// Sistema de armazenamento de mídia otimizado com IndexedDB
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
  blob?: Blob; // Para armazenar o arquivo real no IndexedDB
}

class MediaStorageManager {
  private readonly MAX_STORAGE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
  private readonly MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB por vídeo
  private readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB por imagem
  private readonly DB_NAME = 'MediaLibraryDB';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'mediaFiles';
  private readonly STATS_STORE = 'storageStats';
  
  private db: IDBDatabase | null = null;

  // Inicializar IndexedDB
  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        reject(new Error('Erro ao abrir IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store para arquivos de mídia
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('uploadDate', 'uploadDate', { unique: false });
          store.createIndex('lastUsed', 'lastUsed', { unique: false });
        }

        // Store para estatísticas
        if (!db.objectStoreNames.contains(this.STATS_STORE)) {
          db.createObjectStore(this.STATS_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  async getStorageStats(): Promise<StorageStats> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          const files = request.result as MediaFile[];
          let totalSize = 0;
          
          files.forEach(file => {
            totalSize += file.size;
          });

          const available = Math.max(0, this.MAX_STORAGE_SIZE - totalSize);
          const percentage = Math.min(100, (totalSize / this.MAX_STORAGE_SIZE) * 100);

          resolve({
            used: totalSize,
            available,
            total: this.MAX_STORAGE_SIZE,
            percentage
          });
        };

        request.onerror = () => {
          reject(new Error('Erro ao calcular estatísticas'));
        };
      });
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

  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> {
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
            
            const tryCompress = () => {
              canvas.toBlob((blob) => {
                if (!blob) {
                  reject(new Error('Erro ao comprimir imagem'));
                  return;
                }
                
                if (blob.size <= this.MAX_IMAGE_SIZE || currentQuality <= 0.1) {
                  resolve(blob);
                } else {
                  currentQuality -= 0.1;
                  tryCompress();
                }
              }, 'image/jpeg', currentQuality);
            };
            
            tryCompress();
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

  async processVideo(file: File): Promise<Blob> {
    // Para vídeos, verificar tamanho primeiro
    if (file.size > this.MAX_VIDEO_SIZE) {
      throw new Error(`Vídeo muito grande. Máximo ${this.MAX_VIDEO_SIZE / 1024 / 1024}MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
    }

    // Retornar o arquivo original como blob
    return file;
  }

  async addMedia(file: File): Promise<MediaFile> {
    try {
      // Verificar espaço disponível
      const stats = await this.getStorageStats();
      if (stats.percentage > 95) {
        throw new Error('Armazenamento quase cheio. Remova alguns arquivos antes de continuar.');
      }

      let blob: Blob;
      let compressed = false;

      if (file.type.startsWith('image/')) {
        blob = await this.compressImage(file);
        compressed = true;
      } else if (file.type.startsWith('video/')) {
        blob = await this.processVideo(file);
        compressed = false;
      } else {
        throw new Error('Tipo de arquivo não suportado');
      }

      // Verificar se o arquivo processado não é muito grande
      if (blob.size > (file.type.startsWith('image/') ? this.MAX_IMAGE_SIZE : this.MAX_VIDEO_SIZE)) {
        throw new Error('Arquivo ainda muito grande após processamento');
      }

      // Criar URL do blob
      const url = URL.createObjectURL(blob);

      const mediaFile: MediaFile = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url,
        size: blob.size,
        compressed,
        uploadDate: new Date(),
        lastUsed: new Date(),
        usageCount: 0,
        blob // Armazenar o blob para salvar no IndexedDB
      };

      // Salvar no IndexedDB
      await this.saveMediaFile(mediaFile);
      
      return mediaFile;
    } catch (error) {
      console.error('Erro ao adicionar mídia:', error);
      throw error;
    }
  }

  private async saveMediaFile(mediaFile: MediaFile): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.put(mediaFile);
      
      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Erro ao salvar arquivo no IndexedDB'));
      };
    });
  }

  async getMediaLibrary(): Promise<MediaFile[]> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          const files = request.result as MediaFile[];
          
          // Recriar URLs dos blobs e converter datas
          const processedFiles = files.map(file => ({
            ...file,
            uploadDate: new Date(file.uploadDate),
            lastUsed: new Date(file.lastUsed),
            url: file.blob ? URL.createObjectURL(file.blob) : file.url
          }));
          
          resolve(processedFiles);
        };

        request.onerror = () => {
          reject(new Error('Erro ao carregar biblioteca de mídia'));
        };
      });
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error);
      return [];
    }
  }

  async removeMedia(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        // Primeiro, obter o arquivo para revogar a URL
        const getRequest = store.get(id);
        
        getRequest.onsuccess = () => {
          const file = getRequest.result as MediaFile;
          if (file && file.url) {
            URL.revokeObjectURL(file.url);
          }
          
          // Agora deletar o arquivo
          const deleteRequest = store.delete(id);
          
          deleteRequest.onsuccess = () => {
            resolve();
          };
          
          deleteRequest.onerror = () => {
            reject(new Error('Erro ao remover arquivo'));
          };
        };

        getRequest.onerror = () => {
          reject(new Error('Erro ao encontrar arquivo para remoção'));
        };
      });
    } catch (error) {
      console.error('Erro ao remover mídia:', error);
      throw error;
    }
  }

  async updateUsage(id: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      return new Promise((resolve, reject) => {
        const getRequest = store.get(id);
        
        getRequest.onsuccess = () => {
          const file = getRequest.result as MediaFile;
          if (file) {
            file.lastUsed = new Date();
            file.usageCount = (file.usageCount || 0) + 1;
            
            const putRequest = store.put(file);
            
            putRequest.onsuccess = () => {
              resolve();
            };
            
            putRequest.onerror = () => {
              reject(new Error('Erro ao atualizar uso do arquivo'));
            };
          } else {
            resolve(); // Arquivo não encontrado, mas não é erro crítico
          }
        };

        getRequest.onerror = () => {
          reject(new Error('Erro ao encontrar arquivo para atualização'));
        };
      });
    } catch (error) {
      console.error('Erro ao atualizar uso:', error);
    }
  }

  async cleanupOldFiles(): Promise<void> {
    try {
      const library = await this.getMediaLibrary();
      
      // Ordenar por último uso e remover os 20% mais antigos
      const sorted = library.sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime());
      const toRemove = Math.floor(sorted.length * 0.2);
      
      for (let i = 0; i < toRemove; i++) {
        await this.removeMedia(sorted[i].id);
      }
      
      console.log(`Removidos ${toRemove} arquivos antigos para liberar espaço`);
    } catch (error) {
      console.error('Erro ao limpar arquivos antigos:', error);
    }
  }

  // Método para migrar dados do localStorage para IndexedDB (se necessário)
  async migrateFromLocalStorage(): Promise<void> {
    try {
      const oldData = localStorage.getItem('media-library-v2');
      if (oldData) {
        const oldLibrary = JSON.parse(oldData) as MediaFile[];
        console.log(`Migrando ${oldLibrary.length} arquivos do localStorage para IndexedDB...`);
        
        // Nota: Os URLs antigos não funcionarão, mas mantemos os metadados
        for (const file of oldLibrary) {
          const migratedFile: MediaFile = {
            ...file,
            uploadDate: new Date(file.uploadDate),
            lastUsed: new Date(file.lastUsed),
            url: '', // URL será recriada quando necessário
            blob: undefined // Blob não existe nos dados antigos
          };
          
          await this.saveMediaFile(migratedFile);
        }
        
        // Remover dados antigos do localStorage
        localStorage.removeItem('media-library-v2');
        console.log('Migração concluída!');
      }
    } catch (error) {
      console.error('Erro na migração:', error);
    }
  }
}

export const mediaStorage = new MediaStorageManager();

