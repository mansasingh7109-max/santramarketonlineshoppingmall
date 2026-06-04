// SANTRA MALL AUTO BACKUP - 4 June 2026, 4:50 PM
// Acode Plugin Script

const fs = acode.require('fs');
const path = acode.require('path');

async function backupProject() {
    const timestamp = '2026-06-04_1650';
    const projectPath = '/storage/emulated/0/SANTRA-MALL';
    const backupPath = `/storage/emulated/0/SANTRA_BACKUPS/SANTRA-MALL_backup_${timestamp}`;
    
    try {
        // Backup folder banao
        await fs.mkdir('/storage/emulated/0/SANTRA_BACKUPS', { recursive: true });
        
        // Copy all files
        await copyFolderRecursive(projectPath, backupPath);
        
        // Info file banao
        const infoContent = `
SANTRA MALL BACKUP
==================
Time: 4 June 2026, 4:50 PM IST
Location: Pilibanga, Rajasthan
Version: 1.0
Files: ${await countFiles(backupPath)}

Backup Created Successfully!
        `;
        
        await fs.writeFile(`${backupPath}/BACKUP_INFO.txt`, infoContent);
        
        acode.alert('Backup Complete', `✅ Folder backed up!\n📁 Path: ${backupPath}\n📅 4 June 2026, 4:50 PM`);
        
        console.log('%c✅ BACKUP COMPLETE', 'color:#10b981;font-size:16px;font-weight:bold');
        console.log('%cTime: 4 June 2026, 4:50 PM IST', 'color:#f59e0b');
        console.log('%cPath:', 'color:#3b82f6', backupPath);
        
    } catch (error) {
        acode.alert('Backup Failed', `❌ Error: ${error.message}`);
        console.error('Backup Error:', error);
    }
}

async function copyFolderRecursive(source, target) {
    const files = await fs.readdir(source);
    
    for (const file of files) {
        const srcPath = path.join(source, file);
        const destPath = path.join(target, file);
        const stat = await fs.stat(srcPath);
        
        if (stat.isDirectory()) {
            await fs.mkdir(destPath, { recursive: true });
            await copyFolderRecursive(srcPath, destPath);
        } else {
            const content = await fs.readFile(srcPath);
            await fs.writeFile(destPath, content);
        }
    }
}

async function countFiles(dir) {
    let count = 0;
    const files = await fs.readdir(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            count += await countFiles(filePath);
        } else {
            count++;
        }
    }
    return count;
}

// Run backup
backupProject();