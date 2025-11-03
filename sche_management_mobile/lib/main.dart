import 'package:flutter/material.dart';

// 1. Import 2 gói mình vừa cài
import 'package:amplify_flutter/amplify_flutter.dart';
import 'package:amplify_auth_cognito/amplify_auth_cognito.dart';
import 'features/auth/login_page.dart';
import 'features/auth/register_page.dart';
import 'features/auth/welcome_page.dart';
import 'features/home/main_navigation.dart';

void main() async {
  // 2. Đảm bảo Flutter được khởi tạo
  WidgetsFlutterBinding.ensureInitialized();

  // 3. Gọi hàm cấu hình Amplify
  await _configureAmplify();

  // 4. Chạy ứng dụng
  runApp(const MyApp());
}

// 5. Viết hàm cấu hình
Future<void> _configureAmplify() async {
  try {
    if (Amplify.isConfigured) {
      safePrint('Amplify đã được cấu hình rồi');
      return;
    }

    // 6. Thêm plugin vào Amplify TRƯỚC KHI configure
    final authPlugin = AmplifyAuthCognito();
    await Amplify.addPlugin(authPlugin);

    // 7. Nạp cấu hình vào Amplify
    safePrint('🔧 Đang configure Amplify...');
    const amplifyConfig = '''
{
  "UserAgent": "aws-amplify-cli/2.0",
  "Version": "1.0",
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
        "UserAgent": "aws-amplify/cli",
        "Version": "1.0",
        "IdentityManager": {
          "Default": {}
        },
        "CognitoUserPool": {
          "Default": {
            "PoolId": "ap-southeast-2_9RLjNQhOk",
            "AppClientId": "6rer5strq9ga876qntv37ngv6d",
            "Region": "ap-southeast-2"
          }
        },
        "Auth": {
          "Default": {
            "OAuth": {
              "WebDomain": "ap-southeast-29rljnqhok.auth.ap-southeast-2.amazoncognito.com",
              "AppClientId": "6rer5strq9ga876qntv37ngv6d",
              "SignInRedirectURI": "scheapp://login",
              "SignOutRedirectURI": "scheapp://logout",
              "Scopes": [
                "openid",
                "email",
                "phone",
                "profile",
                "aws.cognito.signin.user.admin"
              ]
            },
            "authenticationFlowType": "USER_SRP_AUTH"
          }
        }
      }
    }
  }
}
''';
    await Amplify.configure(amplifyConfig);

    safePrint(
      '✅ Amplify cấu hình thành công: isConfigured=${Amplify.isConfigured}',
    );
  } on Exception catch (e) {
    safePrint('LỖI: Không thể cấu hình Amplify - $e');
    rethrow; // Throw lại để biết nếu có lỗi
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NVH Sinh Viên',
      debugShowCheckedModeBanner: false, // Tắt DEBUG banner
      theme: ThemeData(
        primaryColor: const Color(0xFFFB923C),
        scaffoldBackgroundColor: const Color(0xFFF9FAFB),
        colorScheme: const ColorScheme.light(
          primary: Color(0xFFFB923C),
          secondary: Color(0xFFF97316),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFFB923C),
            foregroundColor: Colors.white,
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
      routes: {
        '/welcome': (_) => const WelcomePage(),
        '/login': (_) => const LoginPage(),
        '/register': (_) => const RegisterPage(),
        '/home': (_) => const MainNavigation(),
      },
      home: const _RootGate(),
    );
  }
}

class _RootGate extends StatelessWidget {
  const _RootGate();

  @override
  Widget build(BuildContext context) {
    // Luôn show MainNavigation đầu tiên (public access)
    // Người dùng chỉ cần đăng nhập khi cần sử dụng chức năng
    return const MainNavigation();
  }
}
