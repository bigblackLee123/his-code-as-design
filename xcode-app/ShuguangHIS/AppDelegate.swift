import Cocoa
import WebKit

@main
class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var httpServer: Process?

    func applicationDidFinishLaunching(_ notification: Notification) {
        let config = WKWebViewConfiguration()
        config.preferences.setValue(true, forKey: "developerExtrasEnabled")

        webView = WKWebView(frame: .zero, configuration: config)

        // 启动本地 HTTP 服务器 serve dist 目录
        let resourcePath = Bundle.main.resourcePath ?? ""
        let distPath = resourcePath + "/dist"
        let port = 19876

        let server = Process()
        server.executableURL = URL(fileURLWithPath: "/usr/bin/python3")
        server.arguments = ["-m", "http.server", "\(port)", "--directory", distPath]
        server.standardOutput = FileHandle.nullDevice
        server.standardError = FileHandle.nullDevice
        try? server.run()
        httpServer = server

        // 等服务器启动
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            let url = URL(string: "http://localhost:\(port)/index.html")!
            self.webView.load(URLRequest(url: url))
        }

        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1920, height: 1080),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "耳界智能诊室系统"
        window.contentView = webView
        window.center()
        window.makeKeyAndOrderFront(nil)
    }

    func applicationWillTerminate(_ notification: Notification) {
        httpServer?.terminate()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
}
