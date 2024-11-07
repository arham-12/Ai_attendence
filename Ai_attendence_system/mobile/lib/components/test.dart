class MyClass {
  // Private variable
  int _privateVariable = 42;

  // Method to access the private variable
  int getPrivateVariable() {
    return _privateVariable;
  }

  // Method to set a new value to the private variable
  void setPrivateVariable(int value) {
    _privateVariable = value;
  }
}


void main(){
  dynamic obj = MyClass();
  print(obj._privateVariable);
}