import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const performBackup = (): void => {
  const date = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); 
  const backupDir = path.join(__dirname, '../../backups', `backup_${date}`);

  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/presenca_plus';

  const cmd = `mongodump --uri="${MONGO_URI}" --out=${backupDir}`;

  console.log(`Executando backup: ${cmd}`);

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Erro ao executar backup: ${error.message}`);
      return;
    }

    if (stderr) {
      console.warn(`⚠️ Aviso no backup: ${stderr}`);
    }

    console.log(`✅ Backup realizado com sucesso:\n${stdout}`);
    keepLastNBackups(path.join(__dirname, '../../backups'), 5);
  });
};

/**
 * Mantém apenas os N backups mais recentes
 * @param dir Diretório onde estão os backups
 * @param n Quantidade máxima de backups a manter
 */
const keepLastNBackups = (dir: string, n: number): void => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Erro ao ler diretório de backups:', err);
      return;
    }

    const sorted = files
      .map((file) => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        return {
          name: file,
          time: stats.mtimeMs,
        };
      })
      .sort((a, b) => a.time - b.time);

    while (sorted.length > n) {
      const oldest = sorted.shift();
      if (!oldest) continue;

      const fullPath = path.join(dir, oldest.name);
      fs.rm(fullPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`❌ Erro ao remover backup antigo: ${fullPath}`, err);
        } else {
          console.log(`🗑️ Backup removido: ${fullPath}`);
        }
      });
    }
  });
};

export default performBackup;