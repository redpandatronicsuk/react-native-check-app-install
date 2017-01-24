import React, {Component} from 'react';
import {ActivityIndicator, ListView, StyleSheet, Text, View, ScrollView, Platform, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';
import * as Animatable from 'react-native-animatable';
/**
 * NOTES
 * =====
 * 
 * Android package names can be found by searching for the app on the PlayStore (https://play.google.com/store/search),
 * then when you look for an app, the package name will be id query parameter in the URL,
 * e.g. for Facebook, the PLayStore URL is: https://play.google.com/store/apps/details?id=com.facebook.katana
 * and from the URL you can see that the package name is `com.facebook.katana`
 * iOS URL schemes can be found by googling or checking this unofficial registry:
 * http://handleopenurl.com/
 */

const brand2color = {
    "whatsapp": "128c7e",
    "facebook": "3b5998",
    "facebook messenger":"3b5998",
    "skype": "00aff0",
    "wechat": "7bb32e",
    "snapchat": "fffc00",
    "twitter": "1da1f2",
    "youtube": "cd201f",
    "netflix": "e50914",
    "instagram": "405de6",
    "spotify": "2ebd59",
    "slack": "6ecadc",
    "pinterest": "bd081c",
    "uber": "09091a",
    "amazon": "ff9900",
    "soundcloud": "ff8800",
    "google maps":"4285f4",
    "chrome": "ea4335",
    "gmail": "dd4b39",
    "google drive":"34a853",
    "dropbox": "007ee5",
    "google hangouts":"dd4b39",
    "evernote": "2dbe60",
    "vlc": "000",
    "tumblr": "35465c",
    "flickr": "0063dc"
};

class App extends Component {

    ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

    constructor(props) {
        super(props);
        this.state = {
            initialised: false,
            appListURL: this.ds.cloneWithRows([]),
            appListPKG: this.ds.cloneWithRows([]),
            appList: this.ds.cloneWithRows([]),
            showPkgList: false
        };
    }

    _appname2icon(app) {
        switch (app) {
            case 'facebook':
                return 'facebook-official';
            case 'facebook messenger':
                return 'facebook';
            case 'google maps':
                return 'map-marker';
            case 'gmail':
                return 'envelope-open';
            case 'google drive':
                return 'database';
            case 'google hangouts':
                return 'phone';
            case 'netflix':
            case 'uber':
            case 'evernote':
            case 'vlc':
                return 'circle';
            default:
              return app;
        }
    }

    renderList(appCheckResults) {
        this.setState(Object.assign(this.state, {
            initialised: true,
            appList: this.ds.cloneWithRows(appCheckResults)
        }));
    }

    renderListURL(appCheckResults) {
        this.setState(Object.assign(this.state, {
            initialised: true,
            appListURL: this.ds.cloneWithRows(appCheckResults)
        }));
    }

    renderListPKG(appCheckResults) {
         this.setState(Object.assign(this.state, {
            initialised: true,
            appListPKG: this.ds.cloneWithRows(appCheckResults),
            showPkgList: true
        }));
    }

    checkPKGs() {
        let appCheckResultsPKG = [],
            checkCounterPKG = 0;
        AppInstalledChecker.getAppList()
            .forEach((d, idx) => {
                    checkCounterPKG++;
                    AppInstalledChecker
                    .isAppInstalledAndroid(d)
                    .then((isInstalled) => {
                        checkCounterPKG--;
                        appCheckResultsPKG.push({name: d, isInstalled: isInstalled, idx: idx});
                        if (checkCounterPKG === 0) {
                            this.renderListPKG(appCheckResultsPKG);
                        }
                    });
            });
    }

    checkURLs() {
        let appCheckResultsURL = [],
        checkCounterURL = 0;
        AppInstalledChecker.getAppList()
            .forEach((d, idx) => {
                checkCounterURL++;
                AppInstalledChecker
                    .isAppInstalledIOS(d)
                    .then((isInstalled) => {
                        checkCounterURL--;
                        appCheckResultsURL.push({name: d, isInstalled: isInstalled, idx: idx});
                        if (checkCounterURL === 0) {
                            this.renderListURL(appCheckResultsURL);
                        }
                    })
                    .catch((err) => {
                        checkCounterURL--;
                        appCheckResultsURL.push({name: d, isInstalled: false, idx: idx});
                        if (checkCounterURL === 0) {
                            this.renderListURL(appCheckResultsURL);
                        }
                    });
            });
    }

    check() {
        let appCheckResults = [],
            checkCounter = 0;
        AppInstalledChecker.getAppList()
            .forEach((d, idx) => {
                    checkCounter++;
                    AppInstalledChecker
                    .isAppInstalled(d)
                    .then((isInstalled) => {
                        checkCounter--;
                        appCheckResults.push({name: d, isInstalled: isInstalled, idx: idx});
                        if (checkCounter === 0) {
                            this.renderList(appCheckResults);
                        }
                    });
            });
    }

    componentWillMount() {
        this.check();
        this.checkURLs();
        Platform.select({
            android: () => { this.checkPKGs(); },
            ios: () => {}
        })();
    }

    _renderRow(rowData) {
        return (
            <Animatable.View animation="zoomInUp" style={styles.row} delay={rowData.idx * 25}>
                <Icon size={30} name={this._appname2icon(rowData.name)} color={'#' + brand2color[rowData.name]}/>
                <Text style={[ styles.appName, {color: rowData.isInstalled ? 'green' : 'red'}]}>
                    {rowData.name}
                </Text>
                <Text>
                    {rowData.isInstalled ? '✔️' : '❌'}
                </Text>
            </Animatable.View>
        );
    }

    render() {
        return (
            <View style={styles.pageContainer}>
                <ScrollView>
                <View>
                    <Text style={styles.pageHeading}>React Native App Install Cheker</Text>
                    {this.state.initialised && this.state.showPkgList
                        ? 
                        <View style={styles.listContainer}>
                            <Text style={styles.listHeading}>PKG List <Icon name="android" size={40}/>:</Text>
                            <Text style={styles.listSubheading}>Using package name, e.g. 'com.twitter.android' to check if the app is installed (Android only):</Text>
                            <ListView
                                dataSource={this.state.appListPKG}
                                enableEmptySections={true}
                                renderRow={this._renderRow.bind(this)}/>
                        </View>
                        : null}
                    {this.state.initialised
                        ? <View style={styles.listContainer}>
                            <Text style={styles.listHeading}>URL List <Icon name="apple" size={40}/>:</Text>
                            <Text style={styles.listSubheading}>Using URL scheme, e.g. 'twitter://' to check if the app is installed (works on iOS and Android):</Text>
                        <ListView
                                dataSource={this.state.appListURL}
                                enableEmptySections={true}
                                renderRow={this._renderRow.bind(this)}/>
                                </View>
                        : <ActivityIndicator/>}
                    {this.state.initialised
                        ? <View style={styles.listContainer}>
                            <Text style={styles.listHeading}>List <Icon name="android" size={40}/> <Icon name="apple" size={40}/>:</Text>
                            <Text style={styles.listSubheading}>Generic function call which will use package name strategy on Android and URL scheme in iOS.</Text>
                        <ListView
                                dataSource={this.state.appList}
                                enableEmptySections={true}
                                renderRow={this._renderRow.bind(this)}/>
                                </View>
                        : <ActivityIndicator/>}
                        </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: '#F5FCFF',
        padding: 5
    },
    listContainer: {
        alignItems: 'center'
    },
    pageHeading: {
        fontSize: 24,
        paddingTop: 15
    },
    listHeading: {
        fontSize: 18,
        marginTop: 10
    },
    listSubheading: {
        fontSize: 12,
    },
    row: {
        alignItems: 'center',
        margin: 5,
        flex: 1,
        flexDirection: 'row'
    },
    appName: {
        marginLeft: 10,
        marginRight: 10,
        flexGrow: 1,
        textAlign: 'center'
    }
});

export default App;
