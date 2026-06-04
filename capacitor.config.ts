const config = {
  appId: 'com.example.app',
  appName: 'foodsafe',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.2.2:5173', // Dit à Capacitor d'aller chercher ton serveur VS Code
    cleartext: true              // Autorise Android à charger du HTTP sans bloquer (évite l'écran blanc)
  },
  windowsAndroidStudioPath: "C:\\Users\\utilisateur\\AppData\\Local\\Programs\\Android Studio\\bin\\studio64.exe"
};

export default config;