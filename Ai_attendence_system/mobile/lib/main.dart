import 'package:flutter/material.dart';
// import 'components/multi_step.dart';
import "components/registeration.dart";
// import 'components/login.dart';
import 'components/multy_step_form.dart';
import 'package:get/get.dart';
// import 'components/costom_stepper.dart';
// import 'components/multy_step_form.dart';
// import 'components/test.dart';
import './pages/personal_details.dart';
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {

    return GetMaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      getPages: [
        GetPage(name: '/', page: () => MultiStepFormPage()), // Home route
        GetPage(name: '/second', page: () => RegisterPage(),transition: Transition.fade, ),
         // Second page route
      ],
      theme: ThemeData(
      
               // Define the main color scheme for the app
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
           // Primary color based on seed
          brightness: Brightness.light, // Light theme, can switch to dark
        ),

        // Use Material 3 (You can disable Material 3 if needed)
        useMaterial3: true,

        // App bar theme customization
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.blueAccent,
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),

        // Elevated button style
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blueAccent,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 32),
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),

        // Text button style (Flat button in Material 2)
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: Colors.blueAccent,
            textStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),

        // Floating Action Button (FAB) theme
        floatingActionButtonTheme: const FloatingActionButtonThemeData(
          backgroundColor: Colors.blueAccent,
          foregroundColor: Colors.white,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(16)),
          ),
        ),

        // Input Decoration Theme for TextFields
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.grey[200],
          contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Colors.transparent),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Colors.blueAccent, width: 2),
          ),
          labelStyle: const TextStyle(color: Colors.blueAccent),
        ),

        // Custom card theme
        cardTheme: CardTheme(
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          margin: const EdgeInsets.all(16),
        ),

        // Chip theme customization
        chipTheme: ChipThemeData(
          backgroundColor: Colors.grey[200],
          disabledColor: Colors.grey[400],
          selectedColor: Colors.blueAccent,
          secondarySelectedColor: Colors.blue[100],
          padding: const EdgeInsets.symmetric(horizontal: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          labelStyle: const TextStyle(color: Colors.black87),
          secondaryLabelStyle: const TextStyle(color: Colors.white),
        ),

        // Dialog theme customization
        dialogTheme: DialogTheme(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          backgroundColor: Colors.white,
          titleTextStyle: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
          contentTextStyle: const TextStyle(
            fontSize: 16,
            color: Colors.black54,
          ),
        ),

        // Text theme for general use across the app
        textTheme: const TextTheme(
          headlineLarge : TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
          headlineMedium: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
          headlineSmall: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.normal,
            color: Colors.black54,
          ),
          bodyLarge: TextStyle(
            fontSize: 14,
            color: Colors.black54,
          ),
          bodyMedium: TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
          bodySmall: TextStyle(
            fontSize: 10,
            color: Colors.grey,
          ),
        ),

        // Custom bottom navigation bar theme
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Colors.white,
          selectedItemColor: Colors.blueAccent,
          unselectedItemColor: Colors.black54,
          elevation: 8,
          showUnselectedLabels: true,
        ),

        // Define scaffold background color
        scaffoldBackgroundColor: Colors.grey[100],
        
        // Customize primary color
        primaryColor: Colors.blueAccent,
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
