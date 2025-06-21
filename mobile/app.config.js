import 'dotenv/config';


export default {
  expo: {
    name: "mobile",
    slug: "mobile",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
      eas: {
        projectId: "a9a41010-05c1-4f6b-9fa2-784b42a028b8"
      }
    },
    android: {
      package: "com.enzo.presencaplus"
    }
  }
};