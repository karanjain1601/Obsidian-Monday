---
title: "Flutter CI/CD and Deployment"
aliases: ["Flutter CI/CD", "Codemagic Flutter", "Fastlane Flutter", "Flutter GitHub Actions", "Flutter App Store", "Flutter Play Store"]
tags: [web-development, flutter, cicd, deployment, advanced]
domain: Web Development
difficulty: advanced
created: 2026-07-30
related: ["[[Flutter_Architecture]]", "[[Flutter_Testing]]", "[[Flutter_Firebase]]"]
status: complete
---

# 🚀 Flutter CI/CD and Deployment

> [!abstract] TL;DR
> Flutter deployment involves: **code signing** (iOS certificates/provisioning profiles via Fastlane Match, Android keystore), **flavors** (dev/staging/prod via `--flavor`), and a **CI pipeline** (lint → test → build → distribute). **Codemagic** is Flutter-first CI (zero config for signing), **GitHub Actions** is the open-source alternative, and **Fastlane** handles store automation. App Store submission requires Xcode provisioning; Play Store requires a signed APK/AAB and a Google Play API service account.

## Intuition — analogy first

Think of deployment like publishing a physical product in three markets (iOS, Android, Web). CI/CD is your quality-control and packaging line: each commit goes through inspection (tests), assembly (build), shrink-wrapping (code signing), and then delivery to the shelf (store). Flavors are like SKUs — the same product with different labels for different channels. Without automation, each "publish" is hours of manual work; with Codemagic or GitHub Actions, it runs on every merge.

---

## How It Works

```mermaid
graph LR
    Push["Git Push\n(PR merge to main)"] --> CI["CI Runner\n(Codemagic / GitHub Actions)"]
    CI --> Lint["flutter analyze\nflutter format --check"]
    Lint --> Test["flutter test\n--coverage"]
    Test --> Build["flutter build\napk / ipa / web"]
    Build --> Sign["Code Signing\niOS: Match · Android: Keystore"]
    Sign --> Dist["Distribute\nFirebase App Distribution\nTestFlight · Play Store Internal"]
    Dist --> Store["Production\nApp Store · Play Store"]

    style Push fill:#0891b2,color:#fff
    style CI fill:#7c3aed,color:#fff
    style Build fill:#059669,color:#fff
    style Sign fill:#d97706,color:#fff
    style Store fill:#dc2626,color:#fff
```

---

## Key Concepts / Details

### Flavors — Dev / Staging / Production

Flavors let a single codebase produce different app variants with different bundle IDs, API URLs, Firebase projects, and icons.

```bash
# Run with a flavor
flutter run --flavor dev -t lib/main_dev.dart
flutter run --flavor staging -t lib/main_staging.dart
flutter build apk --flavor prod -t lib/main_prod.dart
flutter build ipa --flavor prod -t lib/main_prod.dart
```

```dart
// lib/main_dev.dart
import 'app_config.dart';
void main() {
  AppConfig.setEnvironment(Flavor.dev);
  runApp(const MyApp());
}

// lib/app_config.dart
enum Flavor { dev, staging, prod }

class AppConfig {
  static late Flavor flavor;
  static void setEnvironment(Flavor f) => flavor = f;

  static String get apiBaseUrl => switch (flavor) {
    Flavor.dev     => 'https://api-dev.example.com',
    Flavor.staging => 'https://api-staging.example.com',
    Flavor.prod    => 'https://api.example.com',
  };
}
```

**Android flavor configuration** (`android/app/build.gradle`):
```groovy
android {
    flavorDimensions "environment"
    productFlavors {
        dev {
            dimension "environment"
            applicationIdSuffix ".dev"
            versionNameSuffix "-dev"
            resValue "string", "app_name", "MyApp Dev"
        }
        prod {
            dimension "environment"
            resValue "string", "app_name", "MyApp"
        }
    }
}
```

---

### Android Code Signing (Keystore)

```bash
# Generate a keystore (one-time)
keytool -genkey -v -keystore ~/keys/release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias release
```

```properties
# android/key.properties (NEVER commit to git)
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=release
storeFile=/home/runner/keys/release.jks
```

```groovy
// android/app/build.gradle
def keystoreProperties = new Properties()
def keystoreFile = rootProject.file('key.properties')
if (keystoreFile.exists()) keystoreProperties.load(new FileInputStream(keystoreFile))

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release { signingConfig signingConfigs.release }
    }
}
```

---

### iOS Code Signing with Fastlane Match

```bash
# Install Fastlane
gem install fastlane

# Initialize Match (first time)
fastlane match init          # creates Matchfile, stores certs in git/S3/GCS
fastlane match development   # sync development certs
fastlane match appstore      # sync distribution certs
```

```ruby
# Fastfile
default_platform(:ios)

platform :ios do
  lane :beta do
    match(type: 'appstore', readonly: true)   # fetch certs from encrypted repo
    build_app(
      scheme: 'prod',
      export_method: 'app-store',
      workspace: 'ios/Runner.xcworkspace',
    )
    upload_to_testflight(skip_waiting_for_build_processing: true)
  end

  lane :deploy do
    match(type: 'appstore', readonly: true)
    build_app(scheme: 'prod', workspace: 'ios/Runner.xcworkspace')
    upload_to_app_store(
      force: true,
      skip_screenshots: true,
      submit_for_review: false,
    )
  end
end
```

---

### GitHub Actions Pipeline

```yaml
# .github/workflows/flutter_ci.yml
name: Flutter CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test & Analyze
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.0'
          channel: stable
          cache: true

      - name: Install dependencies
        run: flutter pub get

      - name: Analyze
        run: flutter analyze

      - name: Format check
        run: dart format --check .

      - name: Run tests with coverage
        run: flutter test --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          file: coverage/lcov.info

  build-android:
    name: Build Android
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.0'

      - name: Setup JDK
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '17'

      - name: Decode keystore
        run: |
          echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 --decode > android/app/release.jks
          echo "storeFile=release.jks" > android/key.properties
          echo "storePassword=${{ secrets.KEYSTORE_PASSWORD }}" >> android/key.properties
          echo "keyAlias=${{ secrets.KEY_ALIAS }}" >> android/key.properties
          echo "keyPassword=${{ secrets.KEY_PASSWORD }}" >> android/key.properties

      - name: Build release AAB
        run: flutter build appbundle --flavor prod -t lib/main_prod.dart --release

      - name: Upload to Play Store (Internal)
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.PLAY_SERVICE_ACCOUNT_JSON }}
          packageName: com.example.myapp
          releaseFiles: build/app/outputs/bundle/prodRelease/app-prod-release.aab
          track: internal

  build-ios:
    name: Build iOS
    needs: test
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.0'

      - name: Install Fastlane
        run: gem install fastlane

      - name: Setup Match
        env:
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_URL: ${{ secrets.MATCH_GIT_URL }}
        run: fastlane match appstore --readonly

      - name: Build & upload to TestFlight
        run: fastlane beta
        env:
          APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.ASC_KEY_ID }}
          APP_STORE_CONNECT_ISSUER_ID: ${{ secrets.ASC_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.ASC_PRIVATE_KEY }}
```

---

### Codemagic — Flutter-First CI

```yaml
# codemagic.yaml
workflows:
  flutter-release:
    name: Flutter Release
    max_build_duration: 60
    environment:
      flutter: stable
      xcode: latest
      cocoapods: default
      vars:
        APP_STORE_CONNECT_ISSUER_ID: Encrypted(...)
        APP_STORE_CONNECT_KEY_IDENTIFIER: Encrypted(...)
        APP_STORE_CONNECT_PRIVATE_KEY: Encrypted(...)

    triggering:
      events: [push]
      branch_patterns:
        - pattern: 'main'

    scripts:
      - name: Install dependencies
        script: flutter pub get

      - name: Analyze
        script: flutter analyze

      - name: Test
        script: flutter test --coverage

      - name: Build Android AAB
        script: |
          flutter build appbundle \
            --flavor prod \
            -t lib/main_prod.dart \
            --release

      - name: Build iOS IPA
        script: |
          flutter build ipa \
            --flavor prod \
            -t lib/main_prod.dart \
            --export-options-plist=/Users/builder/export_options.plist

    artifacts:
      - build/app/outputs/bundle/**/*.aab
      - build/ios/ipa/*.ipa
      - flutter_drive.log

    publishing:
      app_store_connect:
        api_key: $APP_STORE_CONNECT_PRIVATE_KEY
        key_id: $APP_STORE_CONNECT_KEY_IDENTIFIER
        issuer_id: $APP_STORE_CONNECT_ISSUER_ID
        submit_to_testflight: true
      google_play:
        credentials: Encrypted(...)
        track: internal
```

---

### App Versioning

```yaml
# pubspec.yaml
version: 1.4.2+45
#         ^^^^^  ^^ build number (Android versionCode, iOS CFBundleVersion)
#         |      used by stores to determine if this is a newer build
#         semantic version shown to users
```

```bash
# Build with explicit version override
flutter build apk --build-name=1.4.2 --build-number=45
```

---

## Trade-offs

| Tool | Strengths | Weaknesses |
|------|-----------|------------|
| Codemagic | Flutter-first, built-in signing UI, free tier | Proprietary, vendor lock-in |
| GitHub Actions | Open source, flexible, huge marketplace | More setup for Flutter; macOS runners cost $$ |
| Fastlane | Battle-tested, great store automation | Ruby dependency; complex setup |
| Bitrise | Good Flutter support, visual pipeline | Expensive at scale |
| Shorebird | Code push (hot patches without store review) | New, limited platform support |

---

## Common Pitfalls

- **Committing `key.properties` or the keystore** — both must be in `.gitignore`. If a keystore leaks, the only fix is a new key (which requires updating all users). Store secrets in CI environment variables.
- **Building in debug mode accidentally** — omitting `--release` on `flutter build` produces a debug build (~5x larger, slower). Always use `--release` for store submissions.
- **iOS builds failing on macOS runners due to Xcode version mismatch** — pin the Xcode version in CI to match your local development environment.
- **Forgetting to increment the build number** — stores reject uploads with the same build number as a previous submission. Automate the build number using `CI_BUILD_NUMBER` or `git rev-list --count HEAD`.
- **Not testing on a physical device before store submission** — simulators don't reveal signing, push notification, or camera permission issues.

---

## Related Concepts

- [[_MOC_Flutter|↑ Section MOC]]
- [[Flutter_Testing]] — the test stage that CI runs
- [[Flutter_Architecture]] — flavors and build modes explained

---

## Review Questions

1. What is a Flutter flavor, and why is it important for multi-environment apps (dev/staging/prod)?
2. Where should the Android keystore and `key.properties` file live? What must never happen to them?
3. What does Fastlane Match do, and how does it solve the iOS code signing problem for teams?
4. In a GitHub Actions Flutter workflow, why do iOS builds require `macos-latest` runners instead of `ubuntu-latest`?
5. How is the Flutter build number (`+45` in `1.4.2+45`) used by the App Store and Play Store?

---

## Sources

- Flutter docs: Build and release Android — https://docs.flutter.dev/deployment/android
- Flutter docs: Build and release iOS — https://docs.flutter.dev/deployment/ios
- Codemagic docs — https://docs.codemagic.io/flutter-configuration/flutter-projects/
- Fastlane docs: Match — https://docs.fastlane.tools/actions/match/
- subosito/flutter-action — https://github.com/subosito/flutter-action

#web-development #flutter #cicd #deployment #codemagic #fastlane #github-actions #code-signing
