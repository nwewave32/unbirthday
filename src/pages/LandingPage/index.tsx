import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import CommonButton from "../../components/ui/CommonButton";
import { generatePageUUID, createEditPageURL } from "../../utils/auth";
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

  const handleCreateClick = () => {
    const uuid = generatePageUUID();
    const editUrl = createEditPageURL(uuid);
    navigate(editUrl);
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
        <CommonButton onClick={handleCreateClick} fullWidth>
          축하페이지 만들기
        </CommonButton>
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
          <CommonButton onClick={handleCreateClick} fullWidth>
            축하페이지 만들기
          </CommonButton>
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
