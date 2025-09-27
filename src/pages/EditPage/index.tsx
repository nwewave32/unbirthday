import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CommonButton from '../../components/ui/CommonButton';
import { parseEditPageURL } from '../../utils/auth';
import { Container, Content, Title, Description } from './styles';

const EditPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();

  const { token } = parseEditPageURL(location.pathname, location.search);

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <Container>
      <Content>
        <Title>편집 페이지</Title>
        <Description>
          이곳에서 생일 축하 페이지를 편집할 수 있습니다.<br />
          곧 멋진 편집 기능이 추가될 예정입니다!
          <br /><br />
          <strong>페이지 UUID:</strong> {uuid || 'N/A'}<br />
          <strong>토큰:</strong> {token || '없음'}
        </Description>
        <CommonButton onClick={handleBackClick} variant="secondary" fullWidth>
          메인으로 돌아가기
        </CommonButton>
      </Content>
    </Container>
  );
};

export default EditPage;