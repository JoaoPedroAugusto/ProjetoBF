import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar diretórios de mídia
const MEDIA_DIR = path.join(__dirname, 'DBmidia');
const IMG_DIR = path.join(MEDIA_DIR, 'DBimg');
const VIDEO_DIR = path.join(MEDIA_DIR, 'DBvideo');

// Garantir que os diretórios existam
fs.ensureDirSync(IMG_DIR);
fs.ensureDirSync(VIDEO_DIR);

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const destDir = isImage ? IMG_DIR : VIDEO_DIR;
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${uniqueId}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB máximo
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv|flv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'));
    }
  }
});

// Servir arquivos estáticos da pasta DBmidia
app.use('/media', express.static(MEDIA_DIR));

// Rota para upload de mídia
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const isImage = req.file.mimetype.startsWith('image/');
    const mediaFile = {
      id: path.parse(req.file.filename).name,
      name: req.file.originalname,
      filename: req.file.filename,
      type: isImage ? 'image' : 'video',
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/media/${isImage ? 'DBimg' : 'DBvideo'}/${req.file.filename}`,
      uploadDate: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      usageCount: 0
    };

    // Salvar metadados em um arquivo JSON
    const metadataFile = path.join(MEDIA_DIR, 'metadata.json');
    let metadata = {};
    
    if (await fs.pathExists(metadataFile)) {
      metadata = await fs.readJson(metadataFile);
    }
    
    metadata[mediaFile.id] = mediaFile;
    await fs.writeJson(metadataFile, metadata, { spaces: 2 });

    res.json({
      success: true,
      file: mediaFile
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar todos os arquivos de mídia
app.get('/api/media', async (req, res) => {
  try {
    const metadataFile = path.join(MEDIA_DIR, 'metadata.json');
    
    if (!(await fs.pathExists(metadataFile))) {
      return res.json({ files: [] });
    }
    
    const metadata = await fs.readJson(metadataFile);
    const files = Object.values(metadata);
    
    res.json({ files });
  } catch (error) {
    console.error('Erro ao listar mídia:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter um arquivo específico
app.get('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const metadataFile = path.join(MEDIA_DIR, 'metadata.json');
    
    if (!(await fs.pathExists(metadataFile))) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    const metadata = await fs.readJson(metadataFile);
    const file = metadata[id];
    
    if (!file) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    // Atualizar último uso
    file.lastUsed = new Date().toISOString();
    file.usageCount = (file.usageCount || 0) + 1;
    
    metadata[id] = file;
    await fs.writeJson(metadataFile, metadata, { spaces: 2 });
    
    res.json({ file });
  } catch (error) {
    console.error('Erro ao obter arquivo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para deletar um arquivo
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const metadataFile = path.join(MEDIA_DIR, 'metadata.json');
    
    if (!(await fs.pathExists(metadataFile))) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    const metadata = await fs.readJson(metadataFile);
    const file = metadata[id];
    
    if (!file) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    // Deletar arquivo físico
    const isImage = file.type === 'image';
    const filePath = path.join(isImage ? IMG_DIR : VIDEO_DIR, file.filename);
    
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    }
    
    // Remover dos metadados
    delete metadata[id];
    await fs.writeJson(metadataFile, metadata, { spaces: 2 });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter estatísticas de armazenamento
app.get('/api/storage/stats', async (req, res) => {
  try {
    const metadataFile = path.join(MEDIA_DIR, 'metadata.json');
    
    if (!(await fs.pathExists(metadataFile))) {
      return res.json({
        used: 0,
        available: 10 * 1024 * 1024 * 1024, // 10GB
        total: 10 * 1024 * 1024 * 1024,
        percentage: 0,
        fileCount: 0
      });
    }
    
    const metadata = await fs.readJson(metadataFile);
    const files = Object.values(metadata);
    
    let totalSize = 0;
    files.forEach(file => {
      totalSize += file.size || 0;
    });
    
    const maxSize = 10 * 1024 * 1024 * 1024; // 10GB
    const available = Math.max(0, maxSize - totalSize);
    const percentage = Math.min(100, (totalSize / maxSize) * 100);
    
    res.json({
      used: totalSize,
      available,
      total: maxSize,
      percentage,
      fileCount: files.length
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para limpeza de arquivos antigos
app.post('/api/storage/cleanup', async (req, res) => {
  try {
    const metadataFile = path.join(MEDIA_DIR, 'metadata.json');
    
    if (!(await fs.pathExists(metadataFile))) {
      return res.json({ removed: 0 });
    }
    
    const metadata = await fs.readJson(metadataFile);
    const files = Object.values(metadata);
    
    // Ordenar por último uso e remover os 20% mais antigos
    const sorted = files.sort((a, b) => 
      new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime()
    );
    
    const toRemove = Math.floor(sorted.length * 0.2);
    let removed = 0;
    
    for (let i = 0; i < toRemove; i++) {
      const file = sorted[i];
      const isImage = file.type === 'image';
      const filePath = path.join(isImage ? IMG_DIR : VIDEO_DIR, file.filename);
      
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
      
      delete metadata[file.id];
      removed++;
    }
    
    await fs.writeJson(metadataFile, metadata, { spaces: 2 });
    
    res.json({ removed });
  } catch (error) {
    console.error('Erro na limpeza:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande' });
    }
  }
  
  console.error('Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Diretório de mídia: ${MEDIA_DIR}`);
  console.log(`Diretório de imagens: ${IMG_DIR}`);
  console.log(`Diretório de vídeos: ${VIDEO_DIR}`);
});

export default app;

