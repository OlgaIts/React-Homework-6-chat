import {Chat} from "./components/Chat";

import styles from "./App.module.scss";
import "./css/global.module.scss";

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Анонимный чат</h1>
      <Chat />
    </div>
  );
}

export default App;
