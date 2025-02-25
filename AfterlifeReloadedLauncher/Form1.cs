using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using System;
using System.Windows.Forms;

namespace AfterlifeReloadedLauncher
{
    public partial class Form1 : Form
    {
        public const int WM_NCLBUTTONDOWN = 0xA1;
        public const int HT_CAPTION = 0x2;

        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern int SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);
        [System.Runtime.InteropServices.DllImport("user32.dll")]
        public static extern bool ReleaseCapture();
        public Form1()
        {
            InitializeComponent();
        }

        private async void Form1_Load(object sender, EventArgs e)
        {
            await InitializeWebView();
        }

        private async System.Threading.Tasks.Task InitializeWebView()
        {
            // Ensure WebView2 is initialized
            await webView21.EnsureCoreWebView2Async();

            // Load your URL
            webView21.Source = new Uri("https://www.afterlifereloaded.com");
        }

        public const int WM_NCHITTEST = 0x0084;
        public const int HTLEFT = 10;
        public const int HTRIGHT = 11;
        public const int HTTOP = 12;
        public const int HTTOPLEFT = 13;
        public const int HTTOPRIGHT = 14;
        public const int HTBOTTOM = 15;
        public const int HTBOTTOMLEFT = 16;
        public const int HTBOTTOMRIGHT = 17;

        protected override void WndProc(ref Message m)
        {
            if (m.Msg == WM_NCHITTEST)
            {
                int x = (int)(m.LParam.ToInt64() & 0xFFFF);
                int y = (int)((m.LParam.ToInt64() & 0xFFFF0000) >> 16);
                Point pt = PointToClient(new Point(x, y));

                Size clientSize = ClientSize;
                if (pt.X <= ResizeBorderWidth && pt.Y <= ResizeBorderWidth)
                    m.Result = (IntPtr)HTTOPLEFT;
                else if (pt.X <= ResizeBorderWidth && pt.Y >= clientSize.Height - ResizeBorderWidth)
                    m.Result = (IntPtr)HTBOTTOMLEFT;
                else if (pt.X >= clientSize.Width - ResizeBorderWidth && pt.Y <= ResizeBorderWidth)
                    m.Result = (IntPtr)HTTOPRIGHT;
                else if (pt.X >= clientSize.Width - ResizeBorderWidth && pt.Y >= clientSize.Height - ResizeBorderWidth)
                    m.Result = (IntPtr)HTBOTTOMRIGHT;
                else if (pt.X <= ResizeBorderWidth)
                    m.Result = (IntPtr)HTLEFT;
                else if (pt.X >= clientSize.Width - ResizeBorderWidth)
                    m.Result = (IntPtr)HTRIGHT;
                else if (pt.Y <= ResizeBorderWidth)
                    m.Result = (IntPtr)HTTOP;
                else if (pt.Y >= clientSize.Height - ResizeBorderWidth)
                    m.Result = (IntPtr)HTBOTTOM;
                else
                    base.WndProc(ref m);
            }
            else
                base.WndProc(ref m);
        }
        private const int ResizeBorderWidth = 50;

        private void panel1_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                ReleaseCapture();
                SendMessage(Handle, WM_NCLBUTTONDOWN, HT_CAPTION, 0);
            }
        }
    }
}
