import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui";
import { type BirthdayPage } from "../../firebase/services";
import {
  cleanupExpiredTokens,
  getPageWithTokenValidation,
  getStoredToken,
  parseEditPageURL,
  validateTokenWithServer,
} from "../../utils/auth";
import { Container, Content, Description, Title } from "./styles";

const EditPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [accessStatus, setAccessStatus] = useState<
    "checking" | "valid" | "invalid" | "expired"
  >("checking");
  const [pageData, setPageData] = useState<BirthdayPage | null>(null);

  const { token } = parseEditPageURL(location.pathname, location.search);

  useEffect(() => {
    const validateAccess = async () => {
      cleanupExpiredTokens();

      if (!uuid) {
        setAccessStatus("invalid");
        return;
      }

      const storedToken = getStoredToken(uuid);
      if (!storedToken) {
        setAccessStatus("expired");
        return;
      }

      // Use token from URL if available, otherwise use stored token
      const tokenToValidate = token || storedToken;

      try {
        // Validate with server
        const isValid = await validateTokenWithServer(uuid, tokenToValidate);

        if (isValid) {
          // Get page data
          const page = await getPageWithTokenValidation(uuid, tokenToValidate);
          if (page) {
            setPageData(page);
            setAccessStatus("valid");
          } else {
            setAccessStatus("expired");
          }
        } else {
          setAccessStatus("invalid");
        }
      } catch (error) {
        console.error("Error validating access:", error);
        setAccessStatus("invalid");
      }
    };

    validateAccess();
  }, [uuid, token]);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleCreateNewPage = () => {
    navigate("/");
  };

  const getAccessStatusMessage = () => {
    switch (accessStatus) {
      case "checking":
        return "접근 권한 확인 중...";
      case "valid":
        return "✅ 유효한 접근입니다";
      case "invalid":
        return "❌ 유효하지 않은 토큰입니다";
      case "expired":
        return "⏰ 토큰이 만료되었습니다";
      default:
        return "";
    }
  };

  return (
    <Container>
      <Content>
        <Title>편집 페이지</Title>
        <Description>
          {accessStatus === "checking" ? (
            <div>접근 권한을 확인하는 중입니다...</div>
          ) : accessStatus === "valid" ? (
            <>
              이곳에서 생일 축하 페이지를 편집할 수 있습니다.
              <br />
              곧 멋진 편집 기능이 추가될 예정입니다!
              <br />
              <br />
              <strong>상태:</strong> {getAccessStatusMessage()}
              <br />
              <strong>페이지 UUID:</strong> {uuid || "N/A"}
              <br />
              <strong>URL 토큰:</strong> {token || "없음"}
              <br />
              <strong>저장된 토큰:</strong>{" "}
              {uuid ? getStoredToken(uuid) || "없음" : "없음"}
              <br />
              <strong>페이지 제목:</strong> {pageData?.title || "로딩 중..."}
              <br />
              <strong>페이지 설명:</strong>{" "}
              {pageData?.description || "로딩 중..."}
            </>
          ) : (
            <>
              <strong>{getAccessStatusMessage()}</strong>
              <br />
              <br />
              {accessStatus === "expired" && (
                <>
                  편집 세션이 만료되었습니다. 새로 생성해주세요.
                  <br />
                  <br />
                  <Button onClick={handleCreateNewPage} fullWidth>
                    새 축하페이지 만들기
                  </Button>
                </>
              )}
              {accessStatus === "invalid" && (
                <>
                  접근 권한이 없습니다. 올바른 링크를 사용해주세요.
                  <br />
                  <br />
                  <Button onClick={handleCreateNewPage} fullWidth>
                    새 축하페이지 만들기
                  </Button>
                </>
              )}
            </>
          )}
        </Description>
        <Button onClick={handleBackClick} variant="secondary" fullWidth>
          메인으로 돌아가기
        </Button>
      </Content>
    </Container>
  );
};

export default EditPage;
