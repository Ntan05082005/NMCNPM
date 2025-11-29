import React, { useEffect, useState } from "react";
import { callProtected } from "../../API/api-test.js";

function ProtectedPage() {
  const [result, setResult] = useState("");

  useEffect(() => {
    callProtected()
      .then((res) => setResult(res.data))
      .catch(() => setResult("Không có token hoặc token sai!"));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Protected Page</h2>
      <p>{result}</p>
    </div>
  );
}

export { ProtectedPage };
export default ProtectedPage;
