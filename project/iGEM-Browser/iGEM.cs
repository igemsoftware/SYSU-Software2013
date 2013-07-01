using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using CefSharp.WinForms;
using CefSharp;

namespace iGEM
{
    public partial class iGEM : Form
    {
        WebView webView;
        public iGEM()
        {
            InitializeComponent();
            this.WindowState = FormWindowState.Maximized;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            BrowserSettings now = new BrowserSettings();
            now.PageCacheDisabled = false;
            now.LocalStorageDisabled = false;
            now.DragDropDisabled = false;
            now.JavaScriptDisabled = false;
            webView = new WebView("http://127.0.0.1:5000", now);
            //webView.PropertyChanged += new PropertyChangedEventHandler(webView_PropertyChanged);
            webView.Dock = DockStyle.Fill;
            this.Controls.Add(webView);
        }


        
        /**
         * Method About explorer history operation
         */
        void webView_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            webView = (WebView)sender;
            switch (e.PropertyName)
            {
                case "IsBrowserInitialized":
                    //webView.IsBrowserInitialized
                    break;
                case "Title":
                    //webView.Title
                    break;
                case "Address":
                    //webView.Address
                    break;
                case "CanGoBack":
                    //webView.CanGoBack
                    break;
                case "CanGoForward":
                    //webView.CanGoForward;
                    break;
                case "IsLoading":
                    //webView.IsLoading
                    break;
            }
        }
    }
}