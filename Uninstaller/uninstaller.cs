// use csc installer.cs to compile
using System;
using System.IO;

// namespace declaration
namespace uninstaller {
      
    // Class declaration
    class uninstall {
          
        // Main Method
        static void Main(string[] args) {
			Directory.Delete(Directory.GetCurrentDirectory() + @"\Files", true);
		}
    }
}