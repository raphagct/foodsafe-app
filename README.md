# FoodSafe

FoodSafe is a cross-platform mobile app built with Flutter and SQLite that helps users learn about food safety, trace products using QR codes, report suspicious food with photos, and keep a local history for offline access.

## Features

- Educational content about food hygiene and safe handling
- QR code scanner for product traceability and easy access to product information
- Report suspicious food items by taking photos and submitting reports
- Local history stored in SQLite so users can access data offline
- Simple, responsive UI built with Flutter

## Tech stack

- Flutter (Dart) — cross-platform mobile UI
- SQLite — local data storage
- QR code scanning (e.g. using `qr_code_scanner` or `mobile_scanner` plugin)

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Flutter SDK (stable) installed: https://flutter.dev/docs/get-started/install
- Android Studio / Xcode (for device emulators and platform tooling)
- A device or emulator to run the app

### Install

1. Clone the repository

   git clone https://github.com/raphagct/foodsafe-app.git
   cd foodsafe-app

2. Install Flutter dependencies

   flutter pub get

3. Run the app

- On an Android device/emulator:

  flutter run

- To build an APK:

  flutter build apk --release

- To run on iOS device/simulator (macOS + Xcode required):

  flutter run

### Configuration

- If the app integrates with any backend services or requires API keys, add them to a secure place (e.g., use environment variables, a local config file excluded from version control, or the platform's secure storage). Document any required keys or endpoints here.

## Project structure (high level)

- lib/ — Flutter app code (screens, models, services)
- assets/ — images, icons, and other static assets
- android/ — Android-specific files
- ios/ — iOS-specific files
- pubspec.yaml — Flutter dependencies and metadata

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a pull request describing your changes

Please open issues for bugs or feature requests so we can track and discuss them.

## Screenshots

_Add screenshots here in the `assets/` folder and link them below._

## License

This project is provided under the MIT License. See the `LICENSE` file for details.

## Contact

Created by @raphagct. Feel free to open issues or pull requests on GitHub.
