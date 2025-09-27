import React from 'react';
import CommonButton from '../../components/ui/CommonButton';
import { Container, Content, Title, Description } from './styles';

const EditPage: React.FC = () => {
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
        </Description>
        <CommonButton onClick={handleBackClick} variant="secondary" fullWidth>
          메인으로 돌아가기
        </CommonButton>
      </Content>
    </Container>
  );
};

export default EditPage;