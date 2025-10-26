import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Input } from '../ui/Input';

export interface MusicPickerProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  musicUrl?: string;
  onUrlChange?: (url: string) => void;
  onFileSelect?: (file: File) => void;
  allowFile?: boolean;
  allowUrl?: boolean;
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  width: 100%;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ToggleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.m};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.m};
`;

const ToggleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.m};
`;

const MusicIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.s};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ToggleTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ToggleTitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ToggleDescription = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ToggleSwitch = styled.button<{ enabled: boolean }>`
  position: relative;
  width: 52px;
  height: 28px;
  background: ${({ theme, enabled }) =>
    enabled ? theme.colors.success : theme.colors.grey[300]};
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ enabled }) => (enabled ? '26px' : '2px')};
    width: 24px;
    height: 24px;
    background: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    transition: all ${({ theme }) => theme.transitions.fast};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    opacity: 0.9;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  padding: ${({ theme }) => theme.spacing.m};
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.m};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.s};
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.border.secondary};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.m}`};
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ theme, active }) => (active ? theme.colors.border.active : 'transparent')};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme, active }) =>
    active ? theme.colors.text.primary : theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: -1.5px;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const TabContent = styled.div`
  padding: ${({ theme }) => theme.spacing.m} 0;
`;

const FileUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FileUploadLabel = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FileUploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.s};
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.l};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.s};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.grey[700]};
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectedFile = styled.div`
  padding: ${({ theme }) => theme.spacing.m};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1.5px solid ${({ theme }) => theme.colors.border.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.s};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.s};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.success};
  }
`;

const MusicIconSvg = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    />
  </svg>
);

const UploadIconSvg = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const CheckIconSvg = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const MusicPicker: React.FC<MusicPickerProps> = ({
  enabled,
  onToggle,
  musicUrl,
  onUrlChange,
  onFileSelect,
  allowFile = true,
  allowUrl = true,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      setSelectedFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <Container className={className}>
      <Label>Background Music (Optional)</Label>

      <ToggleSection>
        <ToggleInfo>
          <MusicIcon>
            <MusicIconSvg />
          </MusicIcon>
          <ToggleTextGroup>
            <ToggleTitle>Enable Background Music</ToggleTitle>
            <ToggleDescription>
              {enabled ? 'Music will play when card opens' : 'No background music'}
            </ToggleDescription>
          </ToggleTextGroup>
        </ToggleInfo>
        <ToggleSwitch enabled={enabled} onClick={() => onToggle(!enabled)} type="button" />
      </ToggleSection>

      {enabled && (
        <OptionsContainer>
          <TabContainer>
            {allowUrl && (
              <Tab active={activeTab === 'url'} onClick={() => setActiveTab('url')} type="button">
                URL
              </Tab>
            )}
            {allowFile && (
              <Tab
                active={activeTab === 'file'}
                onClick={() => setActiveTab('file')}
                type="button"
              >
                Upload File
              </Tab>
            )}
          </TabContainer>

          <TabContent>
            {activeTab === 'url' && allowUrl && onUrlChange && (
              <Input
                type="url"
                label="Music URL"
                placeholder="https://example.com/music.mp3"
                value={musicUrl || ''}
                onChange={(e) => onUrlChange(e.target.value)}
                fullWidth
              />
            )}

            {activeTab === 'file' && allowFile && onFileSelect && (
              <FileUploadSection>
                <FileUploadLabel>Upload Audio File</FileUploadLabel>
                <FileUploadButton>
                  <UploadIconSvg />
                  Choose File
                  <HiddenFileInput
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                  />
                </FileUploadButton>
                {selectedFileName && (
                  <SelectedFile>
                    <CheckIconSvg />
                    {selectedFileName}
                  </SelectedFile>
                )}
              </FileUploadSection>
            )}
          </TabContent>
        </OptionsContainer>
      )}
    </Container>
  );
};

export default MusicPicker;
