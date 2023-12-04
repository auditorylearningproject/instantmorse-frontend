import AppLayout from "./layouts/App.vue"
import BlankLayout from "./layouts/Blank.vue"

interface Layouts {
    [key: string]: any;
  }
  
  const layouts: Layouts = {
    "BlankLayout": BlankLayout,
    "AppLayout": AppLayout,
  };
  
  export default layouts;