class UC18 {
    constructor() {
      this.waitForRequests();
    }
  
    waitForRequests() {
      while (true) {
        const request = this.receiveRequestFromWorker();
  
        if (request) {
          try {
            const charactersList = this.parseRequest(request);
            this.sendCharactersListToWorker(charactersList);
          } catch (error) {
            this.sendAbortSignalToWorker((error as Error).message);
          }
        }
  
        // 何らかの条件でループを抜ける（例: 特定のリクエストが来た場合）
        // または非同期処理を導入することも検討する
      }
    }
  
    receiveRequestFromWorker(): string | null {
      return "example request";
    }
  
    parseRequest(request: string): string[] {
      // まだincomplete
      return [""];
    }
  
    sendCharactersListToWorker(charactersList: string[]) {
      console.log("Sending characters list to worker:", charactersList);
    }
  
    sendAbortSignalToWorker(errorMessage: string) {
      console.error("Parsing error. Sending abort signal to worker:", errorMessage);
    }
  }
  
  const backend = new UC18();