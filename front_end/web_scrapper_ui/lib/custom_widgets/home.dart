import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Center(
          child: TextField(
            decoration: InputDecoration(
                border: OutlineInputBorder(), hintText: "Enter Search"),
          ),
        ),
        Center(
          child: ElevatedButton(
            onPressed: null,
            child: Text("Click me"),
          ),
        ),
      ],
    );
  }
}
