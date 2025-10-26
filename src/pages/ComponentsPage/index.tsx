import React, { useState } from "react";
import styled from "styled-components";
import {
  BirthdayEditor,
  EditHeaderBar,
  LayoutPicker,
  MusicPicker,
  PageTitleEditor,
  ThemePicker,
  type HeroStyle,
  type LayoutType,
  type ThemeOption,
} from "../../components/feature";
import {
  Badge,
  BottomActionBar,
  Button,
  Card,
  FullScreenOverlay,
  Input,
  Modal,
  Typography,
} from "../../components/ui";
import { useToast } from "../../hooks/useToast";

const PageContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.primary};
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xxxxl};
`;

const SectionTitle = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  padding-bottom: ${({ theme }) => theme.spacing.m};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border.secondary};
`;

const DemoGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.l};
`;

const DemoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.m};
  align-items: center;
`;

const DemoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.m};
  flex: 1;
  min-width: 250px;
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.colors.grey[100]};
  padding: ${({ theme }) => theme.spacing.m};
  border-radius: ${({ theme }) => theme.borderRadius.m};
  overflow-x: auto;
  font-size: 14px;
  font-family: "Monaco", "Courier New", monospace;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.m};
`;

const ComponentsPage: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [isLargeModalOpen, setIsLargeModalOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showActionBar, setShowActionBar] = useState(true);
  const [actionBarLoading, setActionBarLoading] = useState(false);
  const [birthdayName, setBirthdayName] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("classic");
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");
  const [layoutType, setLayoutType] = useState<LayoutType>("grid");
  const [heroStyle, setHeroStyle] = useState<HeroStyle>("full");

  const toast = useToast();

  const demoThemes: ThemeOption[] = [
    {
      id: "classic",
      name: "Classic",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#ffffff",
      fontFamily:
        '"Helvetica Now Display Medium", Helvetica, Arial, sans-serif',
      preview: {
        heading: "Happy Birthday!",
        body: "Hope your day is amazing",
      },
    },
    {
      id: "sunset",
      name: "Sunset",
      background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      textColor: "#ffffff",
      fontFamily: '"Palatino LT Pro Light", serif',
      preview: {
        heading: "Celebrate!",
        body: "Wishing you joy",
      },
    },
    {
      id: "ocean",
      name: "Ocean",
      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      textColor: "#111111",
      fontFamily: '"Helvetica Now Text", Helvetica, Arial, sans-serif',
      preview: {
        heading: "Best Wishes",
        body: "Have a wonderful day",
      },
    },
    {
      id: "minimal",
      name: "Minimal",
      background: "#f5f5f5",
      textColor: "#111111",
      fontFamily: '"Helvetica Now Text Medium", Helvetica, Arial, sans-serif',
      preview: {
        heading: "Happy Birthday",
        body: "Simple and elegant",
      },
    },
  ];

  const demoImages = [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
  ];

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // SVG Icons for BottomActionBar
  const ShareIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  );

  const DownloadIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );

  const CreateIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );

  return (
    <PageContainer>
      <Header>
        <Typography variant="h1" weight="bold" align="center">
          Component Page
        </Typography>
        <Typography variant="body1" color="secondary" align="center">
          Reusable components built with theme guidelines
        </Typography>
      </Header>

      {/* EditHeaderBar Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Edit Header Bar
            </Typography>
            <Typography variant="body2" color="secondary">
              Sticky header for edit pages with back button, title, and save
              action
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography
                variant="h4"
                weight="medium"
                style={{ marginBottom: "12px" }}
              >
                Live Demo
              </Typography>
              <EditHeaderBar
                title="Edit Birthday Card"
                onBack={() => toast.showToast("Back clicked", "info")}
                onSave={() => {
                  setIsSaving(true);
                  toast.showToast("Saving...", "info");
                  setTimeout(() => {
                    setIsSaving(false);
                    toast.showToast("Saved successfully!", "success");
                  }, 2000);
                }}
                saveLoading={isSaving}
              />
            </div>

            <div>
              <Typography
                variant="h4"
                weight="medium"
                style={{ marginBottom: "12px" }}
              >
                Features
              </Typography>
              <Typography variant="body2">
                • Sticky positioning at top
              </Typography>
              <Typography variant="body2">
                • Back button with custom handler
              </Typography>
              <Typography variant="body2">• Centered page title</Typography>
              <Typography variant="body2">
                • Save button with loading state
              </Typography>
              <Typography variant="body2">
                • Optional visibility controls
              </Typography>
              <Typography variant="body2">• Responsive design</Typography>
            </div>

            <CodeBlock>{`import { EditHeaderBar } from '@/components/';

function EditPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveData();
    setIsSaving(false);
  };

  return (
    <div>
      <EditHeaderBar
        title="Edit Birthday Card"
        onBack={() => router.back()}
        onSave={handleSave}
        saveLabel="Save"
        saveLoading={isSaving}
        saveDisabled={!hasChanges}
      />
      {/* Page content */}
    </div>
  );
}`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* PageTitleEditor Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Page Title Editor
            </Typography>
            <Typography variant="body2" color="secondary">
              Large, prominent text input for page titles and names
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography
                variant="h4"
                weight="medium"
                style={{ marginBottom: "12px" }}
              >
                Single Title Editor
              </Typography>
              <PageTitleEditor
                value={pageTitle}
                onChange={setPageTitle}
                placeholder="Enter page title..."
                label="Page Title"
                maxLength={50}
              />
            </div>

            <div>
              <Typography
                variant="h4"
                weight="medium"
                style={{ marginBottom: "12px" }}
              >
                Birthday Editor (Combined)
              </Typography>
              <BirthdayEditor
                name={birthdayName}
                date={birthdayDate}
                onNameChange={setBirthdayName}
                onDateChange={setBirthdayDate}
                nameLabel="Birthday Person's Name"
                dateLabel="Birthday Date"
                namePlaceholder="Enter name..."
              />
            </div>

            <CodeBlock>{`import { PageTitleEditor, BirthdayEditor } from '@/components/';

// Single title editor
function PageEditor() {
  const [title, setTitle] = useState('');

  return (
    <PageTitleEditor
      value={title}
      onChange={setTitle}
      placeholder="Enter title..."
      maxLength={50}
    />
  );
}

// Birthday editor with name and date
function BirthdayForm() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  return (
    <BirthdayEditor
      name={name}
      date={date}
      onNameChange={setName}
      onDateChange={setDate}
    />
  );
}`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* ThemePicker Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Theme Picker
            </Typography>
            <Typography variant="body2" color="secondary">
              Select background and font combinations for your card
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <ThemePicker
                themes={demoThemes}
                selectedThemeId={selectedTheme}
                onSelect={(themeId) => {
                  setSelectedTheme(themeId);
                  toast.showToast(`Theme "${themeId}" selected!`, "success");
                }}
              />
            </div>

            <CodeBlock>{`import { ThemePicker, type ThemeOption } from '@/components/';

const themes: ThemeOption[] = [
  {
    id: 'classic',
    name: 'Classic',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    fontFamily: '"Helvetica Now Display Medium", sans-serif',
    preview: {
      heading: 'Happy Birthday!',
      body: 'Hope your day is amazing',
    },
  },
  // ... more themes
];

<ThemePicker
  themes={themes}
  selectedThemeId={selectedTheme}
  onSelect={setSelectedTheme}
/>`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* MusicPicker Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Music Picker
            </Typography>
            <Typography variant="body2" color="secondary">
              Optional background music with URL or file upload
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <MusicPicker
                enabled={musicEnabled}
                onToggle={(enabled) => {
                  setMusicEnabled(enabled);
                  toast.showToast(
                    enabled ? "Music enabled" : "Music disabled",
                    "info"
                  );
                }}
                musicUrl={musicUrl}
                onUrlChange={setMusicUrl}
                onFileSelect={(file) => {
                  toast.showToast(`File selected: ${file.name}`, "success");
                }}
                allowFile={true}
                allowUrl={true}
              />
            </div>

            <CodeBlock>{`import { MusicPicker } from '@/components/';

<MusicPicker
  enabled={musicEnabled}
  onToggle={setMusicEnabled}
  musicUrl={musicUrl}
  onUrlChange={setMusicUrl}
  onFileSelect={(file) => {
    // Handle file upload
    console.log('Selected file:', file.name);
  }}
  allowFile={true}
  allowUrl={true}
/>`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* LayoutPicker Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Layout Picker
            </Typography>
            <Typography variant="body2" color="secondary">
              Choose grid/masonry layout and hero section style
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <LayoutPicker
                layoutType={layoutType}
                heroStyle={heroStyle}
                onLayoutChange={(layout) => {
                  setLayoutType(layout);
                  toast.showToast(`Layout changed to ${layout}`, "info");
                }}
                onHeroStyleChange={(style) => {
                  setHeroStyle(style);
                  toast.showToast(`Hero style changed to ${style}`, "info");
                }}
              />
            </div>

            <CodeBlock>{`import { LayoutPicker, type LayoutType, type HeroStyle } from '@/components/';

function PageEditor() {
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [hero, setHero] = useState<HeroStyle>('full');

  return (
    <LayoutPicker
      layoutType={layout}
      heroStyle={hero}
      onLayoutChange={setLayout}
      onHeroStyleChange={setHero}
    />
  );
}`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Typography Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Typography
            </Typography>
            <Typography variant="body2" color="secondary">
              Text components with various styles and weights
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography variant="h1" weight="bold">
                Heading 1 - Bold
              </Typography>
              <Typography variant="h2" weight="medium">
                Heading 2 - Medium
              </Typography>
              <Typography variant="h3" weight="medium">
                Heading 3 - Medium
              </Typography>
              <Typography variant="h4" weight="medium">
                Heading 4 - Medium
              </Typography>
              <Typography variant="body1">
                Body 1 - Regular text for paragraphs
              </Typography>
              <Typography variant="body2" color="secondary">
                Body 2 - Secondary text
              </Typography>
              <Typography variant="caption" color="disabled">
                Caption - Disabled text
              </Typography>
            </div>

            <CodeBlock>{`<Typography variant="h1" weight="bold">
  Heading 1
</Typography>
<Typography variant="body1" color="secondary">
  Body text
</Typography>`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Button Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Buttons
            </Typography>
            <Typography variant="body2" color="secondary">
              Interactive button components with multiple variants and sizes
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography variant="h4" weight="medium">
                Variants
              </Typography>
              <DemoRow>
                <Button
                  variant="primary"
                  onClick={() => alert("Primary clicked!")}
                >
                  Primary
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => alert("Secondary clicked!")}
                >
                  Secondary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => alert("Outline clicked!")}
                >
                  Outline
                </Button>
              </DemoRow>
            </div>

            <div>
              <Typography variant="h4" weight="medium">
                Sizes
              </Typography>
              <DemoRow>
                <Button size="s">Small</Button>
                <Button size="m">Medium</Button>
                <Button size="l">Large</Button>
              </DemoRow>
            </div>

            <div>
              <Typography variant="h4" weight="medium">
                States
              </Typography>
              <DemoRow>
                <Button disabled>Disabled</Button>
                <Button loading={isLoading} onClick={handleLoadingDemo}>
                  {isLoading ? "Loading" : "Click to Load"}
                </Button>
                <Button fullWidth>Full Width</Button>
              </DemoRow>
            </div>

            <CodeBlock>{`<Button variant="primary" size="m" onClick={handleClick}>
  Click Me
</Button>
<Button variant="outline" loading={isLoading}>
  Loading Button
</Button>`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Input Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Inputs
            </Typography>
            <Typography variant="body2" color="secondary">
              Form input components with validation states
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <DemoRow>
              <DemoColumn>
                <Input
                  label="Basic Input"
                  placeholder="Enter text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input
                  label="Email Input"
                  type="email"
                  placeholder="email@example.com"
                />
                <Input
                  label="Password Input"
                  type="password"
                  placeholder="Enter password"
                />
              </DemoColumn>

              <DemoColumn>
                <Input
                  label="Disabled Input"
                  placeholder="Disabled..."
                  disabled
                />
                <Input
                  label="Error Input"
                  placeholder="Enter value..."
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  error={true}
                  errorMessage="This field is required"
                />
                <Input
                  label="Full Width Input"
                  placeholder="Full width..."
                  fullWidth
                />
              </DemoColumn>
            </DemoRow>

            <CodeBlock>{`<Input
  label="Email"
  type="email"
  placeholder="email@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={hasError}
  errorMessage="Invalid email"
/>`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Card Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Cards
            </Typography>
            <Typography variant="body2" color="secondary">
              Container components with different styles
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <DemoRow>
              <Card variant="default" padding="m">
                <Typography variant="h4" weight="medium">
                  Default Card
                </Typography>
                <Typography variant="body2" color="secondary">
                  Simple card with default background
                </Typography>
              </Card>

              <Card variant="elevated" padding="m">
                <Typography variant="h4" weight="medium">
                  Elevated Card
                </Typography>
                <Typography variant="body2" color="secondary">
                  Card with shadow elevation
                </Typography>
              </Card>

              <Card variant="outlined" padding="m">
                <Typography variant="h4" weight="medium">
                  Outlined Card
                </Typography>
                <Typography variant="body2" color="secondary">
                  Card with border outline
                </Typography>
              </Card>
            </DemoRow>

            <DemoRow>
              <Card variant="elevated" padding="m" hoverable>
                <Typography variant="h4" weight="medium">
                  Hoverable Card
                </Typography>
                <Typography variant="body2" color="secondary">
                  Hover over me to see the effect!
                </Typography>
              </Card>

              <Card
                variant="elevated"
                padding="m"
                onClick={() => alert("Card clicked!")}
              >
                <Typography variant="h4" weight="medium">
                  Clickable Card
                </Typography>
                <Typography variant="body2" color="secondary">
                  Click me to trigger an action
                </Typography>
              </Card>
            </DemoRow>

            <CodeBlock>{`<Card variant="elevated" padding="l" hoverable>
  <Typography variant="h3">Card Title</Typography>
  <Typography variant="body2">Card content</Typography>
</Card>`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Badge Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Badges
            </Typography>
            <Typography variant="body2" color="secondary">
              Small status indicators and labels
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography variant="h4" weight="medium">
                Variants
              </Typography>
              <DemoRow>
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
              </DemoRow>
            </div>

            <div>
              <Typography variant="h4" weight="medium">
                Sizes
              </Typography>
              <DemoRow>
                <Badge size="s">Small</Badge>
                <Badge size="m">Medium</Badge>
              </DemoRow>
            </div>

            <div>
              <Typography variant="h4" weight="medium">
                Usage Example
              </Typography>
              <Card variant="elevated" padding="m">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4" weight="medium">
                    Order Status
                  </Typography>
                  <Badge variant="success">Delivered</Badge>
                </div>
                <Typography variant="body2" color="secondary">
                  Your order has been successfully delivered
                </Typography>
              </Card>
            </div>

            <CodeBlock>{`<Badge variant="success">Active</Badge>
<Badge variant="error">Cancelled</Badge>
<Badge variant="info" size="s">New</Badge>`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Toast Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Toast / Snackbar
            </Typography>
            <Typography variant="body2" color="secondary">
              Notification messages that appear temporarily
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography variant="h4" weight="medium">
                Variants
              </Typography>
              <DemoRow>
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.showToast("Success! Operation completed", "success")
                  }
                >
                  Success Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.showToast("Error! Something went wrong", "error")
                  }
                >
                  Error Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.showToast(
                      "Warning! Please check your input",
                      "warning"
                    )
                  }
                >
                  Warning Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    toast.showToast("Info: New updates available", "info")
                  }
                >
                  Info Toast
                </Button>
              </DemoRow>
            </div>

            <div>
              <Typography variant="h4" weight="medium">
                Custom Duration
              </Typography>
              <DemoRow>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.showToast(
                      "This will disappear in 1 second",
                      "info",
                      1000
                    )
                  }
                >
                  1 Second
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    toast.showToast(
                      "This will stay for 5 seconds",
                      "success",
                      5000
                    )
                  }
                >
                  5 Seconds
                </Button>
              </DemoRow>
            </div>

            <CodeBlock>{`import { useToast } from '@/components/';

function MyComponent() {
  const toast = useToast();

  const handleClick = () => {
    toast.showToast('Success!', 'success', 3000);
  };

  return <Button onClick={handleClick}>Show Toast</Button>;
}`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Modal Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Modal
            </Typography>
            <Typography variant="body2" color="secondary">
              Dialog windows with focus trap and ESC to close
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography variant="h4" weight="medium">
                Sizes
              </Typography>
              <DemoRow>
                <Button
                  variant="primary"
                  onClick={() => setIsSmallModalOpen(true)}
                >
                  Small Modal
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Medium Modal
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setIsLargeModalOpen(true)}
                >
                  Large Modal
                </Button>
              </DemoRow>
            </div>

            <CodeBlock>{`import { Modal } from '@/components/';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        size="m"
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <Typography variant="body1">
          Modal content goes here...
        </Typography>
      </Modal>
    </>
  );
}`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* FullScreenOverlay Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              FullScreen Overlay
            </Typography>
            <Typography variant="body2" color="secondary">
              Lightbox for images and videos with navigation
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography variant="h4" weight="medium">
                Image Gallery Example
              </Typography>
              <DemoRow>
                <Button
                  variant="primary"
                  onClick={() => setIsOverlayOpen(true)}
                >
                  Open Image Gallery
                </Button>
              </DemoRow>
              <Typography variant="body2" color="secondary">
                Use ESC to close, Arrow keys or buttons to navigate
              </Typography>
            </div>

            <CodeBlock>{`import { FullScreenOverlay } from '@/components/';

function ImageGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>View Gallery</Button>

      <FullScreenOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnEsc={true}
        onPrevious={() => setCurrentIndex(prev => prev - 1)}
        onNext={() => setCurrentIndex(prev => prev + 1)}
        hasPrevious={currentIndex > 0}
        hasNext={currentIndex < images.length - 1}
        caption={\`Image \${currentIndex + 1} of \${images.length}\`}
      >
        <img src={images[currentIndex]} alt="Gallery" />
      </FullScreenOverlay>
    </>
  );
}`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* BottomActionBar Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Bottom Action Bar
            </Typography>
            <Typography variant="body2" color="secondary">
              Fixed CTA row with primary actions (Share, Download, Create)
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <div>
              <Typography variant="h4" weight="medium">
                Demo Controls
              </Typography>
              <DemoRow>
                <Button
                  variant={showActionBar ? "outline" : "primary"}
                  onClick={() => setShowActionBar(!showActionBar)}
                >
                  {showActionBar ? "Hide Action Bar" : "Show Action Bar"}
                </Button>
              </DemoRow>
              <Typography variant="body2" color="secondary">
                {showActionBar
                  ? "The action bar is now visible at the bottom of the page. Scroll down to see it!"
                  : "Click to show the fixed action bar at the bottom"}
              </Typography>
            </div>

            <div>
              <Typography variant="h4" weight="medium">
                Features
              </Typography>
              <Typography variant="body2">
                • Fixed positioning at bottom of screen
              </Typography>
              <Typography variant="body2">
                • Multiple action buttons with icons
              </Typography>
              <Typography variant="body2">
                • Support for primary, secondary, outline variants
              </Typography>
              <Typography variant="body2">• Loading states</Typography>
              <Typography variant="body2">
                • Responsive design for mobile
              </Typography>
              <Typography variant="body2">• Box shadow elevation</Typography>
            </div>

            <CodeBlock>{`import { BottomActionBar } from '@/components/';

function MyPage() {
  const ShareIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342..." />
    </svg>
  );

  const actions = [
    {
      label: 'Share',
      icon: ShareIcon,
      onClick: () => handleShare(),
      variant: 'outline' as const,
    },
    {
      label: 'Download',
      icon: DownloadIcon,
      onClick: () => handleDownload(),
      variant: 'secondary' as const,
    },
    {
      label: 'Create',
      icon: CreateIcon,
      onClick: () => handleCreate(),
      variant: 'primary' as const,
    },
  ];

  return (
    <div>
      {/* Your page content */}
      <BottomActionBar actions={actions} fixed={true} />
    </div>
  );
}`}</CodeBlock>
          </DemoGrid>
        </Card>
      </Section>

      {/* Color Palette Section */}
      <Section>
        <Card variant="outlined" padding="l">
          <SectionTitle>
            <Typography variant="h2" weight="bold">
              Color Palette
            </Typography>
          </SectionTitle>

          <DemoGrid>
            <DemoRow>
              <Card variant="default" padding="s">
                <div
                  style={{
                    width: "100%",
                    height: "60px",
                    background: "#111111",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />
                <Typography variant="caption" weight="medium">
                  Primary Black
                </Typography>
                <Typography variant="caption" color="secondary">
                  #111111
                </Typography>
              </Card>

              <Card variant="default" padding="s">
                <div
                  style={{
                    width: "100%",
                    height: "60px",
                    background: "#F5F5F5",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    border: "1px solid #E5E5E5",
                  }}
                />
                <Typography variant="caption" weight="medium">
                  Secondary Grey
                </Typography>
                <Typography variant="caption" color="secondary">
                  #F5F5F5
                </Typography>
              </Card>

              <Card variant="default" padding="s">
                <div
                  style={{
                    width: "100%",
                    height: "60px",
                    background: "#FF5000",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />

                <Typography variant="caption" color="secondary">
                  #FF5000
                </Typography>
              </Card>

              <Card variant="default" padding="s">
                <div
                  style={{
                    width: "100%",
                    height: "60px",
                    background: "#EE0005",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                />
                <Typography variant="caption" weight="medium">
                  SNKRS Red
                </Typography>
                <Typography variant="caption" color="secondary">
                  #EE0005
                </Typography>
              </Card>
            </DemoRow>
          </DemoGrid>
        </Card>
      </Section>

      {/* Modals */}
      <Modal
        isOpen={isSmallModalOpen}
        onClose={() => setIsSmallModalOpen(false)}
        title="Small Modal"
        size="s"
      >
        <Typography variant="body1">
          This is a small modal. Perfect for simple confirmations or brief
          messages.
        </Typography>
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Button
            variant="primary"
            onClick={() => setIsSmallModalOpen(false)}
            fullWidth
          >
            Confirm
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSmallModalOpen(false)}
            fullWidth
          >
            Cancel
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Medium Modal Example"
        size="m"
      >
        <Typography variant="body1" style={{ marginBottom: "16px" }}>
          This is a medium-sized modal with more content. It includes focus trap
          functionality, so pressing TAB will cycle through interactive elements
          within the modal.
        </Typography>
        <Input
          label="Your Name"
          placeholder="Enter your name..."
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              toast.showToast("Form submitted successfully!", "success");
              setIsModalOpen(false);
            }}
          >
            Submit
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isLargeModalOpen}
        onClose={() => setIsLargeModalOpen(false)}
        title="Large Modal - Terms and Conditions"
        size="l"
      >
        <Typography
          variant="h4"
          weight="medium"
          style={{ marginBottom: "12px" }}
        >
          1. Introduction
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "16px" }}>
          Welcome to our service. By using our platform, you agree to these
          terms and conditions. Please read them carefully before proceeding.
        </Typography>
        <Typography
          variant="h4"
          weight="medium"
          style={{ marginBottom: "12px" }}
        >
          2. User Responsibilities
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "16px" }}>
          You are responsible for maintaining the confidentiality of your
          account and password. You agree to accept responsibility for all
          activities that occur under your account.
        </Typography>
        <Typography
          variant="h4"
          weight="medium"
          style={{ marginBottom: "12px" }}
        >
          3. Privacy Policy
        </Typography>
        <Typography variant="body1" style={{ marginBottom: "16px" }}>
          We take your privacy seriously. All personal information collected
          will be handled in accordance with our privacy policy and applicable
          data protection laws.
        </Typography>
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <Button variant="outline" onClick={() => setIsLargeModalOpen(false)}>
            Decline
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              toast.showToast("Terms accepted", "success");
              setIsLargeModalOpen(false);
            }}
          >
            Accept
          </Button>
        </div>
      </Modal>

      {/* FullScreen Overlay */}
      <FullScreenOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        closeOnEsc={true}
        onPrevious={() => setCurrentImageIndex((prev) => Math.max(0, prev - 1))}
        onNext={() =>
          setCurrentImageIndex((prev) =>
            Math.min(demoImages.length - 1, prev + 1)
          )
        }
        hasPrevious={currentImageIndex > 0}
        hasNext={currentImageIndex < demoImages.length - 1}
        caption={`Image ${currentImageIndex + 1} of ${demoImages.length}`}
      >
        <img
          src={demoImages[currentImageIndex]}
          alt={`Demo ${currentImageIndex + 1}`}
          style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
        />
      </FullScreenOverlay>

      {/* Bottom Action Bar Demo */}
      {showActionBar && (
        <BottomActionBar
          actions={[
            {
              label: "Share",
              icon: ShareIcon,
              onClick: () => toast.showToast("Share clicked!", "info"),
              variant: "outline",
            },
            {
              label: "Download",
              icon: DownloadIcon,
              onClick: () => {
                setActionBarLoading(true);
                toast.showToast("Downloading...", "info");
                setTimeout(() => {
                  setActionBarLoading(false);
                  toast.showToast("Download complete!", "success");
                }, 2000);
              },
              variant: "secondary",
              loading: actionBarLoading,
            },
            {
              label: "Create",
              icon: CreateIcon,
              onClick: () => toast.showToast("Create new item!", "success"),
              variant: "primary",
            },
          ]}
          fixed={true}
        />
      )}
    </PageContainer>
  );
};

export default ComponentsPage;
