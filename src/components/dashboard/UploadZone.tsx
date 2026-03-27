import { UploadCloud, Zap, Download } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import { Service, ServiceType, TrackerType } from '../../types';
import { toast } from 'sonner';

interface UploadZoneProps {
  onUpload: (services: Service[]) => void;
  onDemo: () => void;
}

export function UploadZone({ onUpload, onDemo }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setIsUploading(true);
    setProgress(30);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setProgress(60);
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        setProgress(80);
        
        const services: Service[] = json.map((row: any, index: number) => {
          return {
            id: `imported-${Date.now()}-${index}`,
            time: row['Hora'] || '00:00',
            type: (row['Tipo (PARTIDA/CHEGADA)'] || 'PARTIDA') as ServiceType,
            clients: row['Clientes (separados por vírgula)'] ? String(row['Clientes (separados por vírgula)']).split(',').map(c => c.trim()) : ['Desconhecido'],
            vehicle: row['Veículo (Matrícula)'] || 'XX-00-XX',
            distance: row['Distância (km)'] ? Number(row['Distância (km)']) : null,
            tracker: (row['Tracker (S5/S7)'] || 'S5') as TrackerType,
            destino: row['Destino'] || '',
            delayMin: 0,
            delayReason: ''
          };
        });

        setProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setProgress(0);
          onUpload(services);
        }, 500);
      } catch (error) {
        console.error(error);
        toast.error('Erro ao processar o ficheiro Excel. Verifique o formato.');
        setIsUploading(false);
        setProgress(0);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="border-border bg-card/80 backdrop-blur-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
          Importar Folha de Serviço
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="h-8 text-[10px] font-bold tracking-widest uppercase hover:bg-primary/10 hover:text-primary">
            <a href="/template_servicos.xlsx" download>
              <Download className="mr-2 h-3 w-3" />
              Template
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={onDemo} className="h-8 text-[10px] font-bold tracking-widest uppercase hover:bg-primary/10 hover:text-primary">
            <Zap className="mr-2 h-3 w-3" />
            Demo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            onChange={handleFile}
            disabled={isUploading}
          />
          <div className="pointer-events-none relative z-0 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div className="mb-2 font-bold text-foreground">Arrastar ficheiro Excel ou clicar</div>
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              .XLSX · .XLS · .CSV
            </div>

            {isUploading && (
              <div className="mt-6 w-full max-w-xs">
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  A processar... {Math.round(progress)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
