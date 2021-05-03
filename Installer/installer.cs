// use csc installer.cs to compile
using System;
using System.IO;
using System.Diagnostics;
using System.ComponentModel;

// namespace declaration
namespace installer {
      
    // Class declaration
    class install {
          
        // Main Method
        static void Main(string[] args) {
			
			
			string installPath = @"C:\Users\" + Environment.UserName + @"\Documents";
			string folderName = @"\Localized Twitch Bot\Files";
			
			// uninstall the old version
			//if (File.Exists(installPath + @"\Localized Twitch Bot\uninstaller.exe")) {
			//	var process = new Process {
			//		StartInfo = new ProcessStartInfo {
			//			FileName = installPath + @"\Localized Twitch Bot\uninstaller.exe"
			//		}
			//	};
			//	process.Start();
			//	process.WaitForExit();
			//}
			
			
			string sourceDirectory = Directory.GetCurrentDirectory();
            string destinationDirectory = installPath + folderName;
			
			if (!Directory.Exists(installPath + @"\Localized Twitch Bot\")) {
				Directory.CreateDirectory(installPath + @"\Localized Twitch Bot\");
			}
			
			// put start file in windows startup 
			string dest = @"C:\Users\" + Environment.UserName + @"\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\runner.exe";
			System.IO.File.Copy(Directory.GetCurrentDirectory() + @"\Files\runner.exe", dest, true);
			
			// move files from this original to run folder 
            try {
                Directory.Move(sourceDirectory + @"\Files", destinationDirectory);
            }
            catch (Exception e) {
                Console.WriteLine(e.Message);
            }
			
			// move uninstaller
			System.IO.File.Copy(destinationDirectory+ @"\uninstaller.exe", installPath + @"\Localized Twitch Bot\uninstaller.exe", true);
			
			
			Process proc = null;
            try
            {
                string batDir = string.Format(@"C:\Users\" + Environment.UserName + @"\Documents\Localized Twitch Bot\Files");
                proc = new Process();
                proc.StartInfo.WorkingDirectory = batDir;
                proc.StartInfo.FileName = "installForever.bat";
                proc.StartInfo.CreateNoWindow = true;
                proc.Start();
                proc.WaitForExit();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace.ToString());
            }
			
			
			proc = null;
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