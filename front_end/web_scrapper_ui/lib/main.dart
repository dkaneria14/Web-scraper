import 'package:flutter/material.dart';
import 'custom_widgets/home.dart';

void main() => runApp(const WebScraperHome());

class WebScraperHome extends StatefulWidget {
  const WebScraperHome({super.key});

  @override
  State<WebScraperHome> createState() => _WebScraperHomeState();
}

class _WebScraperHomeState extends State<WebScraperHome> {
  int _currentInd = 1;
  final List<Widget> _tabs = const [Home(), Home(), Home()];

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Center(
            child: Text("Web Scrapper"),
          ),
        ),
        body: Center(child: _tabs.elementAt(_currentInd)),
        bottomNavigationBar: createNavBar(),
      ),
    );
  }

  BottomNavigationBar createNavBar() {
    return BottomNavigationBar(
      currentIndex: _currentInd,
      backgroundColor: Colors.lightBlue,
      fixedColor: Colors.orange[300],
      unselectedItemColor: Colors.white,
      type: BottomNavigationBarType.fixed,
      items: [
        //Item 1
        createNavItem("Search", const Icon(Icons.search)),
        //Item 2
        createNavItem("Home", const Icon(Icons.home)),
        //Item 3
        createNavItem("Profile", const Icon(Icons.account_circle)),
      ],
      onTap: (index) {
        setState(() {
          _currentInd = index;
        });
      },
    );
  }

  BottomNavigationBarItem createNavItem(String title, Icon ic) {
    return BottomNavigationBarItem(
      icon: ic,
      label: title,
    );
  } //createNavItem
}
