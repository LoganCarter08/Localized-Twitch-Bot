// use csc installer.cs to compile
using System;
using System.IO;
using System.Diagnostics;
using System.ComponentModel;

// namespace declaration
namespace runner {
      
    // Class declaration
    class runner {
          
        // Main Method
        static void Main(string[] args) {
			
			Process proc = null;
            try
            {
                string batDir = string.Format(@"C:\Users\" + Environment.UserName + @"\Documents\Localized Twitch Bot\Files");
                proc = new Process();
                proc.StartInfo.WorkingDirectory = batDir;
                proc.StartInfo.FileName = "start.bat";
                proc.StartInfo.CreateNoWindow = false;
                proc.Start();
                proc.WaitForExit();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace.ToString());
            }
        }
    }
}