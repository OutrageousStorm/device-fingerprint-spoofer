package com.outrageousstorm.fingerprintspoof

import android.app.Activity
import android.os.Build
import android.os.Bundle
import android.widget.TextView

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val tv = findViewById<TextView>(R.id.status_text)
        val info = buildString {
            appendLine("Device Fingerprint Info")
            appendLine("======================")
            appendLine("Model: ${Build.MODEL}")
            appendLine("Brand: ${Build.BRAND}")
            appendLine("Device: ${Build.DEVICE}")
            appendLine("Manufacturer: ${Build.MANUFACTURER}")
            appendLine("Product: ${Build.PRODUCT}")
            appendLine("Build: ${Build.ID}")
            appendLine("Android: ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})")
            appendLine("Type: ${Build.TYPE}")
            appendLine("Tags: ${Build.TAGS}")
            appendLine("
To spoof: use the Python tool or Frida scripts")
        }
        tv.text = info
    }
}
