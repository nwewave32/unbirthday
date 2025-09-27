import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  color: white;
  position: relative;
  overflow: hidden;
`;

export const Section = styled.section`
  padding: 40px 16px;
  width: 100%;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Section1 = styled(Section)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 16px;
`;

export const Section2 = styled(Section)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 60px 16px;
`;

export const Section3 = styled(Section)`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 60px 16px;
`;

export const Section4 = styled(Section)`
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  padding: 60px 16px;
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
  word-break: keep-all;
  padding: 0 8px;
`;


export const ImagePlaceholder = styled.div`
  width: 100%;
  max-width: 320px;
  height: 180px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  border: 2px dashed rgba(255, 255, 255, 0.3);
`;

export const PlaceholderText = styled.span`
  font-size: 0.9rem;
  opacity: 0.7;
  text-align: center;
  padding: 0 8px;
`;

export const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.3);
  padding: 32px 16px;
  text-align: center;

  p {
    margin: 8px 0;
    opacity: 0.8;
    font-size: 0.85rem;
  }
`;

export const FinalCTA = styled.div`
  margin-bottom: 24px;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    line-height: 1.3;
    word-break: keep-all;
    padding: 0 8px;
  }
`;