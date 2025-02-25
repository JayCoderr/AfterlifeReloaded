namespace AfterlifeReloadedLauncher
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            webView21 = new Microsoft.Web.WebView2.WinForms.WebView2();
            panel1 = new Panel();
            ((System.ComponentModel.ISupportInitialize)webView21).BeginInit();
            panel1.SuspendLayout();
            SuspendLayout();
            // 
            // webView21
            // 
            webView21.AllowExternalDrop = true;
            webView21.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            webView21.BackColor = Color.FromArgb(15, 15, 15);
            webView21.CreationProperties = null;
            webView21.DefaultBackgroundColor = Color.White;
            webView21.ForeColor = Color.White;
            webView21.Location = new Point(5, 8);
            webView21.Name = "webView21";
            webView21.Size = new Size(838, 548);
            webView21.TabIndex = 0;
            webView21.ZoomFactor = 1D;
            // 
            // panel1
            // 
            panel1.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            panel1.BackColor = Color.FromArgb(0, 0, 194);
            panel1.Controls.Add(webView21);
            panel1.Location = new Point(3, 2);
            panel1.Name = "panel1";
            panel1.Size = new Size(846, 561);
            panel1.TabIndex = 1;
            panel1.MouseDown += panel1_MouseDown;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(0, 0, 194);
            ClientSize = new Size(853, 565);
            Controls.Add(panel1);
            FormBorderStyle = FormBorderStyle.None;
            Name = "Form1";
            Padding = new Padding(10);
            Text = "Form1";
            TransparencyKey = Color.FromArgb(0, 0, 194);
            Load += Form1_Load;
            ((System.ComponentModel.ISupportInitialize)webView21).EndInit();
            panel1.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private Microsoft.Web.WebView2.WinForms.WebView2 webView21;
        private Panel panel1;
    }
}