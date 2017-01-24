package com.rpt.reactnativecheckpackageinstallation;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.content.pm.PackageManager;
import android.content.Context;

public class CheckPackageInstallationModule extends ReactContextBaseJavaModule {
    Context ctx;
    public CheckPackageInstallationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.ctx = reactContext.getApplicationContext();
    }

    @Override
    public String getName() {
        return "CheckPackageInstallation";
    }

    @ReactMethod
    public void isPackageInstalled(String packageName, Callback cb) {
        PackageManager pm = this.ctx.getPackageManager();
        try {
            pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            cb.invoke(true);
        } catch (Exception e) {
            cb.invoke(false);
        }
    }
}