import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase/config";

function App() {
  const [firebaseStatus, setFirebaseStatus] = useState("연결 테스트 중...");
  const [testResults, setTestResults] = useState<string[]>([]);

  const testFirebaseConnection = async () => {
    const results: string[] = [];

    try {
      // Firestore 연결 테스트
      results.push("✅ Firestore 연결 성공");

      // 테스트 컬렉션에 문서 추가
      const testDoc = await addDoc(collection(db, "test"), {
        message: "Firebase 연결 테스트",
        timestamp: new Date(),
      });
      results.push(`✅ Firestore 쓰기 성공: ${testDoc.id}`);

      // 테스트 컬렉션에서 문서 읽기
      const querySnapshot = await getDocs(collection(db, "test"));
      results.push(
        `✅ Firestore 읽기 성공: ${querySnapshot.docs.length}개 문서`
      );

      // Storage는 Blaze 플랜에서만 사용 가능
      results.push("⚠️ Storage 테스트 생략 (Blaze 플랜 필요)");

      setFirebaseStatus("🎉 Firebase 연결 완료!");
      setTestResults(results);
    } catch (error) {
      console.error("Firebase 연결 오류:", error);
      results.push(`❌ 오류 발생: ${error}`);
      setFirebaseStatus("❌ Firebase 연결 실패");
      setTestResults(results);
    }
  };

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Firebase 연결 테스트</h1>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>{firebaseStatus}</h2>

        <div style={{ marginTop: "10px" }}>
          {testResults.map((result, index) => (
            <div key={index} style={{ margin: "5px 0" }}>
              {result}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={testFirebaseConnection}
        style={{
          padding: "10px 20px",
          background: "#007acc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        🔄 다시 테스트
      </button>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>Firebase 프로젝트: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</p>
        <p>
          환경 변수 상태:{" "}
          {import.meta.env.VITE_FIREBASE_API_KEY ? "✅ 설정됨" : "❌ 누락"}
        </p>
      </div>
    </div>
  );
}

export default App;
