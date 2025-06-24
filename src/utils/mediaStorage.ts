// Sistema de armazenamento de mídia com backend Node.js
export interface StorageStats {
  used: number;
  available: number;
  total: number;
  percentage: number;
  fileCount: number;
}

export interface MediaFile {
  id: string;
  name: string;
  filename: string;
  type: 'image' | 'video';
  mimetype: string;
  url: string;
  size: number;
  uploadDate: string;
  lastUsed: string;
  usageCount: number;
}

class MediaStorageManager {
  private readonly API_BASE_URL = 'http://localhost:3001/api';
  
  // Upload de mídia para o servidor
  async addMedia(file: File): Promise<MediaFile> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no upload');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Falha no upload');
      }

      // Converter URL relativa para URL completa
      const mediaFile = {
        ...result.file,
        url: `http://localhost:3001${result.file.url}`
      };

      return mediaFile;
    } catch (error) {
      console.error('Erro ao adicionar mídia:', error);
      throw error;
    }
  }

  // Obter biblioteca de mídia
  async getMediaLibrary(): Promise<MediaFile[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/media`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar biblioteca');
      }

      const result = await response.json();
      
      // Converter URLs relativas para URLs completas
      const files = result.files.map((file: MediaFile) => ({
        ...file,
        url: `http://localhost:3001${file.url.replace('http://localhost:3001', '')}`
      }));

      return files;
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error);
      return [];
    }
  }

  // Remover mídia
  async removeMedia(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao remover arquivo');
      }
    } catch (error) {
      console.error('Erro ao remover mídia:', error);
      throw error;
    }
  }

  // Atualizar uso de mídia
  async updateUsage(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/media/${id}`);
      
      if (!response.ok) {
        console.warn('Erro ao atualizar uso do arquivo');
      }
    } catch (error) {
      console.warn('Erro ao atualizar uso:', error);
    }
  }

  // Obter estatísticas de armazenamento
  async getStorageStats(): Promise<StorageStats> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/storage/stats`);
      
      if (!response.ok) {
        throw new Error('Erro ao obter estatísticas');
      }

      const stats = await response.json();
      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        used: 0,
        available: 10 * 1024 * 1024 * 1024, // 10GB
        total: 10 * 1024 * 1024 * 1024,
        percentage: 0,
        fileCount: 0
      };
    }
  }

  // Limpeza de arquivos antigos
  async cleanupOldFiles(): Promise<number> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/storage/cleanup`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erro na limpeza');
      }

      const result = await response.json();
      return result.removed || 0;
    } catch (error) {
      console.error('Erro na limpeza:', error);
      return 0;
    }
  }

  // Método para verificar se o servidor está rodando
  async checkServerStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/storage/stats`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Método para obter URL completa de um arquivo
  getFileUrl(relativePath: string): string {
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    return `http://localhost:3001${relativePath}`;
  }

  // Método para comprimir imagem (mantido para compatibilidade)
  async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          let { width, height } = img;
          const aspectRatio = width / height;
          
          if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Erro ao comprimir imagem'));
              }
            }, 'image/jpeg', quality);
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

  // Método para migração (não necessário com backend)
  async migrateFromLocalStorage(): Promise<void> {
    try {
      const oldData = localStorage.getItem('media-library-v2');
      if (oldData) {
        console.log('Dados antigos encontrados no localStorage. Considere migrar manualmente se necessário.');
        // Não removemos automaticamente para evitar perda de dados
      }
    } catch (error) {
      console.warn('Erro ao verificar dados antigos:', error);
    }
  }
}

export const mediaStorage = new MediaStorageManager();

// Função utilitária para verificar se o servidor está rodando
export const checkServerConnection = async (): Promise<boolean> => {
  return await mediaStorage.checkServerStatus();
};

// Função utilitária para inicializar o sistema de mídia
export const initializeMediaSystem = async (): Promise<void> => {
  const isServerRunning = await checkServerConnection();
  
  if (!isServerRunning) {
    console.warn('Servidor de mídia não está rodando. Execute "npm run server" para iniciar.');
    throw new Error('Servidor de mídia não disponível. Inicie o servidor backend primeiro.');
  }
  
  console.log('Sistema de mídia inicializado com sucesso!');
};

