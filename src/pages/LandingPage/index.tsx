import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../components/ui/CommonButton";
import { createPageWithToken } from "../../firebase/services";
import {
  createEditPageURL,
  generatePageUUID,
  generateToken,
  hasValidTokenForAnyPage,
  storeToken,
} from "../../utils/auth";
import {
  Container,
  FinalCTA,
  Footer,
  ImagePlaceholder,
  PlaceholderText,
  Section1,
  Section2,
  Section3,
  Section4,
  Title,
} from "./styles";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [existingPage, setExistingPage] = useState<{
    uuid: string;
    token: string;
  } | null>(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Check for existing page on component mount
    const checkExistingPage = async () => {
      try {
        const existing = await hasValidTokenForAnyPage();
        setExistingPage(existing);
      } catch (error) {
        console.error("Error checking existing page:", error);
      } finally {
        setCheckingExisting(false);
      }
    };

    checkExistingPage();
  }, []);

  const handleCreateClick = async () => {
    try {
      // Check if there's already a valid token for this browser
      const existingToken = await hasValidTokenForAnyPage();

      if (existingToken) {
        // Use existing token and navigate to that page
        console.log("Using existing valid token:", existingToken.uuid);
        const editUrl = createEditPageURL(
          existingToken.uuid,
          existingToken.token
        );
        navigate(editUrl);
        return;
      }

      // No valid token exists, create new page
      const uuid = generatePageUUID();
      const token = generateToken();

      // Create page in Firebase with default settings
      const pageId = await createPageWithToken(uuid, token, {
        title: "새로운 생일 축하 페이지",
        description: "특별한 생일을 위한 페이지입니다",
        theme: "default",
        uploadLimit: 50, // 50MB default limit
      });

      console.log("New page created with ID:", pageId);

      // Store token in browser cookie
      storeToken(uuid, token);

      // Navigate to edit page
      const editUrl = createEditPageURL(uuid, token);
      navigate(editUrl);
    } catch (error) {
      console.error("Error creating birthday page:", error);
      alert("페이지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        numberOfPieces={200}
        recycle={false}
        gravity={0.1}
      />
      {/* Section 1 */}
      <Section1>
        <Title>특별한 생일을 선물하세요!</Title>
        {checkingExisting ? (
          <CommonButton disabled fullWidth>
            확인 중...
          </CommonButton>
        ) : (
          <CommonButton onClick={handleCreateClick} fullWidth>
            {existingPage ? "내 축하페이지 편집하기" : "축하페이지 만들기"}
          </CommonButton>
        )}
        {existingPage && !checkingExisting && (
          <p style={{ marginTop: "10px", fontSize: "0.9rem", opacity: 0.8 }}>
            이미 편집중인 페이지가 있습니다!
          </p>
        )}
      </Section1>

      {/* Section 2 */}
      <Section2>
        <ImagePlaceholder>
          <PlaceholderText>완성 페이지 이미지 (추후 삽입)</PlaceholderText>
        </ImagePlaceholder>
      </Section2>

      {/* Section 3 */}
      <Section3>
        <ImagePlaceholder>
          <PlaceholderText>편집 페이지 이미지 (추후 삽입)</PlaceholderText>
        </ImagePlaceholder>
      </Section3>

      {/* Section 4 */}
      <Section4>
        <FinalCTA>
          <h2>지금 생일을 축하하러 가요!</h2>
          {checkingExisting ? (
            <CommonButton disabled fullWidth>
              확인 중...
            </CommonButton>
          ) : (
            <CommonButton onClick={handleCreateClick} fullWidth>
              {existingPage ? "내 축하페이지 편집하기" : "축하페이지 만들기"}
            </CommonButton>
          )}
        </FinalCTA>
      </Section4>

      {/* Footer */}
      <Footer>
        <p>&copy; 2024 Unbirthday</p>
        <p>특별한 날을 더욱 특별하게</p>
        <p>문의: contact@unbirthday.com</p>
      </Footer>
    </Container>
  );
};

export default LandingPage;
