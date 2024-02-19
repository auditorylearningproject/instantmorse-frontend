class UC16 {
    display() {
      if (this.sessionRequiresParameters()) {
        this.displayParameterSetting();
      } else {
        this.displayRecordingPermissionsDialog();
      }
    }
  
    sessionRequiresParameters(): boolean {
      //実際の使い方に合わせて変える
      return false;
    }
  
    displayParameterSetting() {
      console.log("Setting session parameters. Please wait...");
    }
  
    displayRecordingPermissionsDialog() {
      
      const userAcceptsDialog = this.getUserAcceptance();
  
      if (userAcceptsDialog) {
        this.recordUserSpeech();
        this.retrieveSessionText();
        this.generateQuizWidget();
      } else {
        this.printErrorMessage("User declined recording permissions");
      }
    }
  
    getUserAcceptance(): boolean {
      //ユーザー次第
      return false;
    }
  
    recordUserSpeech() {
      console.log("Recording user speech");
    }
  
    retrieveSessionText() {
      console.log("Retrieving session text");
    }
  
    generateQuizWidget() {
      console.log("Generating quiz widget");
    }
  
    printErrorMessage(message: string) {
      console.error(message);
    }
  }
  
 // const homePage = new UC16();
  