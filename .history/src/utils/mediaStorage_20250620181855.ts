// Sistema de armazenamento de mídia otimizado
export interface StorageStats {
  used: number;
  available: number;
  total: number;
  percentage: number;
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  size: number;
  compressed: boolean;
  uploadDate: Date;
  lastUsed: Date;
  usageCount: number;
}

class MediaStorageManager {
  private readonly MAX_STORAGE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
  private readonly MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB por vídeo
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB por imagem
  private readonly STORAGE_KEY = 'media-library-v2';
  private readonly STATS_KEY = 'storage-stats';

  async getStorageStats(): Promise<StorageStats> {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += new Blob([localStorage[key]]).size;
        }
      }

      const available = this.MAX_STORAGE_SIZE - totalSize;
      const percentage = (totalSize / this.MAX_STORAGE_SIZE) * 100;

      return {
        used: totalSize,
        available: Math.max(0, available),
        total: this.MAX_STORAGE_SIZE,
        percentage: Math.min(100, percentage)
      };
    } catch (error) {
      console.error('Erro ao calcular estatísticas de armazenamento:', error);
      return {
        used: 0,
        available: this.MAX_STORAGE_SIZE,
        total: this.MAX_STORAGE_SIZE,
        percentage: 0
      };
    }
  }

  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calcular dimensões otimizadas
          let { width, height } = img;
          const aspectRatio = width / height;
          
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          
          // Configurar canvas com alta qualidade
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            // Tentar diferentes qualidades até encontrar um tamanho aceitável
            let currentQuality = quality;
            let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
            
            while (dataUrl.length > this.MAX_IMAGE_SIZE && currentQuality > 0.1) {
              currentQuality -= 0.1;
              dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
            }
            
            if (dataUrl.length > this.MAX_IMAGE_SIZE) {
              // Se ainda for muito grande, reduzir dimensões
              const newWidth = Math.floor(width * 0.8);
              const newHeight = Math.floor(height * 0.8);
              canvas.width = newWidth;
              canvas.height = newHeight;
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            }
            
            resolve(dataUrl);
          } else {
            reject(new Error('Não foi possível obter contexto do canvas'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  }

  async processVideo(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Para vídeos, verificar tamanho primeiro
      if (file.size > this.MAX_VIDEO_SIZE) {
        reject(new Error(`Vídeo muito grande. Máximo ${this.MAX_VIDEO_SIZE / 1024 / 1024}MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(1)}MB`));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Erro ao ler arquivo de vídeo'));
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  }

  async addMedia(file: File): Promise<MediaFile> {
    try {
      // Verificar espaço disponível
      const stats = await this.getStorageStats();
      if (stats.percentage > 95) {
        throw new Error('Armazenamento quase cheio. Remova alguns arquivos antes de continuar.');
      }

      let dataUrl: string;
      let compressed = false;

      if (file.type.startsWith('image/')) {
        dataUrl = await this.compressImage(file);
        compressed = true;
      } else if (file.type.startsWith('video/')) {
        dataUrl = await this.processVideo(file);
        compressed = false;
      } else {
        throw new Error('Tipo de arquivo não suportado');
      }

      // Verificar se o arquivo processado não é muito grande
      const finalSize = new Blob([dataUrl]).size;
      if (finalSize > (file.type.startsWith('image/') ? this.MAX_IMAGE_SIZE : this.MAX_VIDEO_SIZE)) {
        throw new Error('Arquivo ainda muito grande após processamento');
      }

      const mediaFile: MediaFile = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: dataUrl,
        size: finalSize,
        compressed,
        uploadDate: new Date(),
        lastUsed: new Date(),
        usageCount: 0
      };

      // Salvar na biblioteca
      const library = this.getMediaLibrary();
      
      library.push(mediaFile);
      this.saveMediaLibrary(library);
      
      return mediaFile;
    } catch (error) {
      console.error('Erro ao adicionar mídia:', error);
      throw error;
    }
  }

  getMediaLibrary(): MediaFile[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const library = JSON.parse(saved);
        return library.map((item: any) => ({
          ...item,
          uploadDate: new Date(item.uploadDate),
          lastUsed: new Date(item.lastUsed)
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error);
      return [];
    }
  }

  saveMediaLibrary(library: MediaFile[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(library));
    } catch (error) {
      console.error('Erro ao salvar biblioteca:', error);
      
      // Se der erro de quota, tentar limpar arquivos antigos
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanupOldFiles();
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(library));
        } catch (retryError) {
          throw new Error('Armazenamento cheio. Remova alguns arquivos manualmente.');
        }
      } else {
        throw error;
      }
    }
  }

  removeMedia(id: string): void {
    const library = this.getMediaLibrary();
    const filtered = library.filter(item => item.id !== id);
    this.saveMediaLibrary(filtered);
  }

  private cleanupOldFiles(): void {
    const library = this.getMediaLibrary();
    
    // Ordenar por último uso e remover os 20% mais antigos
    const sorted = library.sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime());
    const toRemove = Math.floor(sorted.length * 0.2);
    const cleaned = sorted.slice(toRemove);
    
    this.saveMediaLibrary(cleaned);
    console.log(`Removidos ${toRemove} arquivos antigos para liberar espaço`);
  }

  updateUsage(id: string): void {
    const library = this.getMediaLibrary();
    const item = library.find(media => media.id === id);
    if (item) {
      item.lastUsed = new Date();
      item.usageCount++;
      this.saveMediaLibrary(library);
    }
  }
}

export const mediaStorage = new MediaStorageManager();