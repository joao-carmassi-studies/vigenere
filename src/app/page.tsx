'use client';

import { useState, useCallback } from 'react';
import {
  LockIcon,
  UnlockIcon,
  CopyIcon,
  CheckIcon,
  EraserIcon,
} from 'lucide-react';
import { encrypt, decrypt } from '@/lib/vigenere';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

type Mode = 'encrypt' | 'decrypt';

export default function VigenereCipher(): React.ReactNode {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = useCallback(() => {
    if (!inputText.trim() || !key.trim()) return;
    const result =
      mode === 'encrypt' ? encrypt(inputText, key) : decrypt(inputText, key);
    setOutput(result);
  }, [inputText, key, mode]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInputText('');
    setKey('');
    setOutput('');
  }, []);

  const handleModeChange = useCallback(
    (value: string[]) => {
      const next = value.find((v) => v !== mode);
      if (next === 'encrypt' || next === 'decrypt') {
        setMode(next);
        setOutput('');
      }
    },
    [mode],
  );

  const isKeyValid = key.trim().length > 0 && /[a-zA-Z]/.test(key);
  const canProcess = inputText.trim().length > 0 && isKeyValid;

  return (
    <div className='flex min-h-dvh flex-col items-center bg-background px-4 py-8 sm:justify-center sm:py-12'>
      <div className='w-full max-w-lg'>
        <header className='mb-6 text-center'>
          <div className='mb-2 flex items-center justify-center gap-2'>
            <LockIcon className='size-6 text-primary' />
            <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Vigenère
            </h1>
          </div>
          <p className='text-sm text-muted-foreground'>
            Criptografe e descriptografe textos com a cifra de Vigenère
          </p>
        </header>

        <Card>
          <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-lg'>
                  {mode === 'encrypt' ? 'Criptografar' : 'Descriptografar'}
                </CardTitle>
                <CardDescription>
                  {mode === 'encrypt'
                    ? 'Transforme texto legível em texto cifrado'
                    : 'Recupere o texto original a partir do cifrado'}
                </CardDescription>
              </div>
              <Badge variant='secondary'>
                {mode === 'encrypt' ? 'ENC' : 'DEC'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-5'>
              <ToggleGroup
                value={[mode]}
                onValueChange={handleModeChange}
                className='w-full'
                variant='outline'
              >
                <ToggleGroupItem value='encrypt' className='flex-1'>
                  <LockIcon data-icon='inline-start' />
                  Criptografar
                </ToggleGroupItem>
                <ToggleGroupItem value='decrypt' className='flex-1'>
                  <UnlockIcon data-icon='inline-start' />
                  Descriptografar
                </ToggleGroupItem>
              </ToggleGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='key'>Chave</FieldLabel>
                  <Input
                    id='key'
                    type='text'
                    placeholder='Digite a palavra-chave...'
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    autoComplete='off'
                  />
                  <FieldDescription>
                    Apenas letras são usadas como chave
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor='input-text'>
                    {mode === 'encrypt' ? 'Texto original' : 'Texto cifrado'}
                  </FieldLabel>
                  <Textarea
                    id='input-text'
                    placeholder={
                      mode === 'encrypt'
                        ? 'Digite o texto para criptografar...'
                        : 'Cole o texto cifrado aqui...'
                    }
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                    className='resize-none'
                  />
                </Field>
              </FieldGroup>

              <div className='flex gap-2'>
                <Button
                  onClick={handleProcess}
                  disabled={!canProcess}
                  className='flex-1'
                >
                  {mode === 'encrypt' ? (
                    <LockIcon data-icon='inline-start' />
                  ) : (
                    <UnlockIcon data-icon='inline-start' />
                  )}
                  {mode === 'encrypt' ? 'Criptografar' : 'Descriptografar'}
                </Button>
                <Button variant='outline' onClick={handleClear}>
                  <EraserIcon data-icon='inline-start' />
                  Limpar
                </Button>
              </div>

              {output && (
                <>
                  <Separator />
                  <Field>
                    <div className='flex items-center justify-between'>
                      <FieldLabel htmlFor='output-text'>Resultado</FieldLabel>
                      <Button variant='ghost' size='sm' onClick={handleCopy}>
                        {copied ? (
                          <CheckIcon data-icon='inline-start' />
                        ) : (
                          <CopyIcon data-icon='inline-start' />
                        )}
                        {copied ? 'Copiado!' : 'Copiar'}
                      </Button>
                    </div>
                    <Textarea
                      id='output-text'
                      value={output}
                      readOnly
                      rows={4}
                      className='resize-none bg-muted font-mono'
                    />
                  </Field>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <footer className='mt-6 text-center text-xs text-muted-foreground'>
          <p>Funciona 100% offline — seus dados nunca saem do dispositivo</p>
        </footer>
      </div>
    </div>
  );
}
