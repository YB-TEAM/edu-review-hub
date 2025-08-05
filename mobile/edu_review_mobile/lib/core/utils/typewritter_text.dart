import 'dart:async';
import 'package:flutter/material.dart';

class TypewriterText extends StatefulWidget {
  final String text;
  final TextStyle? style;
  final Duration typingDuration;
  final Duration holdDuration;
  final Duration fadeDuration;

  const TypewriterText({
    Key? key,
    required this.text,
    this.style,
    this.typingDuration = const Duration(milliseconds: 70),
    this.holdDuration = const Duration(seconds: 2),
    this.fadeDuration = const Duration(milliseconds: 800),
  }) : super(key: key);

  @override
  State<TypewriterText> createState() => _TypewriterTextState();
}

class _TypewriterTextState extends State<TypewriterText> {
  String _displayedText = '';
  int _index = 0;
  Timer? _typingTimer;
  bool _isVisible = true;

  void _startTypingLoop() {
    _displayedText = '';
    _index = 0;
    _isVisible = true;
    setState(() {});

    _typingTimer = Timer.periodic(widget.typingDuration, (timer) {
      if (_index < widget.text.length) {
        setState(() {
          _displayedText += widget.text[_index];
          _index++;
        });
      } else {
        timer.cancel();
        _startHoldAndFade();
      }
    });
  }

  void _startHoldAndFade() {
    Future.delayed(widget.holdDuration, () {
      setState(() => _isVisible = false);

      Future.delayed(widget.fadeDuration, () {
        _startTypingLoop();
      });
    });
  }

  @override
  void initState() {
    super.initState();
    _startTypingLoop();
  }

  @override
  void dispose() {
    _typingTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      opacity: _isVisible ? 1.0 : 0.0,
      duration: widget.fadeDuration,
      child: Text(
        _displayedText,
        style: widget.style,
        overflow: TextOverflow.clip,
      ),
    );
  }
}
