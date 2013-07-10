using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using CefSharp.WinForms;
using CefSharp;

namespace Test
{
    public partial class Form1 : Form
    {
        WebView webView;
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            webView = new WebView("http://www.google.com", new BrowserSettings());
            webView.PropertyChanged += new PropertyChangedEventHandler(webView_PropertyChanged);
            webView.Dock = DockStyle.Fill;
            this.Controls.Add(webView);
        }
        
        // Get all propertys from https://github.com/chillitom/CefSharp/blob/master/CefSharp/BrowserCore.h
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
