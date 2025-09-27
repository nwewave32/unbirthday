import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Content = styled.div`
  text-align: center;
  width: 100%;
  max-width: 320px;
  padding: 0 8px;
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
  word-break: keep-all;
`;

export const Description = styled.div`
  font-size: 1rem;
  margin-bottom: 32px;
  opacity: 0.9;
  line-height: 1.5;
  word-break: keep-all;
`;

