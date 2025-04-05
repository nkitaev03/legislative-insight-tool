
import React, { useState } from 'react';
import { Upload, X, FileIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface FileInfo {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
}

interface FileUploaderProps {
  title?: string;
  accepted?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  title = 'Загрузка файлов',
  accepted = '*',
  maxSize = 10,
  multiple = true
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles: FileInfo[] = [];
    
    Array.from(fileList).forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Файл слишком большой",
          description: `${file.name} превышает максимальный размер ${maxSize}MB`,
          variant: "destructive"
        });
        return;
      }
      
      // Add file to list
      newFiles.push({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'unknown',
        uploadDate: new Date().toLocaleString('ru-RU')
      });
    });
    
    if (newFiles.length > 0) {
      setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
      toast({
        title: "Файлы загружены",
        description: `Успешно загружено ${newFiles.length} файл(ов)`,
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('zip') || type.includes('compressed')) return '🗜️';
    return '📁';
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <Upload 
            className={`h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} 
            strokeWidth={1.5}
          />
          <div className="text-center">
            <p className="text-base font-medium">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Перетащите файлы сюда или нажмите для выбора
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Максимальный размер: {maxSize}MB
            </p>
          </div>
          <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
            Выбрать файлы
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept={accepted}
            multiple={multiple}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-medium">Загруженные файлы ({files.length})</p>
          <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
            {files.map(file => (
              <Card key={file.id} className="bg-muted/40">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getFileIcon(file.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{file.size}</span>
                          <span className="mx-2">•</span>
                          <span>{file.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-destructive"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Удалить</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
