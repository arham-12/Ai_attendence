import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../controlors/form_controller.dart';
import '../pages/personal_details.dart';
import '../pages/academic_details.dart';
import '../pages/give_image.dart';

class MultiStepFormPage extends StatelessWidget {
  final PageController _pageController = PageController();
  final FormController controller = Get.put(FormController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text('Multi-Step Form')),
      body: Container(
        color: Colors.blue[50],
        child: Stack(
          children: [
            Container(
              height: MediaQuery.of(context).size.height / 3,
              decoration: const BoxDecoration(
                color: Colors.blue,
                // borderRadius: BorderRadius.only(bottomLeft: Radius.circular(80),bottomRight: Radius.circular(80)),
          
                // gradient: LinearGradient(
                //   colors: [Color.fromARGB(255, 2, 61, 163), Color.fromARGB(255, 30, 136, 235)], // Background gradient colors
                //   begin: Alignment.topCenter,
                //   end: Alignment.bottomCenter,
                // ),
                
              ),
            ),
        
          ListView(
              children: [
                Container(
            margin: EdgeInsets.only(top:MediaQuery.of(context).size.height/10,),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Center(
                          child: Text(
                            'Rigister',
                            style: TextStyle(fontSize: 32, color: Colors.white),
                            
                            
                          ),
                        ),
                        SizedBox(height: 16,),
                         Center(
                child: Container(
            
                  padding: EdgeInsets.all(32.0),
                  height: MediaQuery.of(context).size.height * 0.7,
                  width: MediaQuery.of(context).size.width * 0.8,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.5),
                        spreadRadius: 2,
                        blurRadius: 5,
                        offset: Offset(0, 3),
                      ),
                    ] 
                  ),
                  child: PageView(
                      controller: _pageController,
                      physics: NeverScrollableScrollPhysics(), // Disable swiping
                      children: [
                        PersonalDetailsPage(pageController: _pageController),
                        AcademicDetailsPage(pageController: _pageController),
                        GiveImagePage(),
                      ],
                    ),
                  ),
                ),
                
                      ]
                    )
                ),
               
              ],
            ),
          ]
        ),
      ),
    );
  }
}
