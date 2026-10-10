
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';

const categories = [
  { icon: '🛣️', title: 'Roads', color: '#E8F0FF' },
  { icon: '💧', title: 'Water', color: '#E1F7F5' },
  { icon: '💡', title: 'Streetlights', color: '#FFF3D9' },
  { icon: '🗑️', title: 'Garbage', color: '#F0E8FF' },
];

const reports = [
  {
    icon: '🛣️',
    title: 'Damaged road',
    location: 'Main Road',
    status: 'Submitted',
    color: '#E6EEFF',
    statusColor: '#315FD3',
  },
  {
    icon: '💡',
    title: 'Streetlight issue',
    location: 'Near City Park',
    status: 'In Progress',
    color: '#FFF0D2',
    statusColor: '#B77913',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
const [issueTitle, setIssueTitle] = useState('');
const [description, setDescription] = useState('');
const [category, setCategory] = useState('');
const [imageUri, setImageUri] = useState(null);
const [location, setLocation] = useState(null);
const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};
 const getCurrentLocation = async () => {
  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please allow location access to report the issue.'
      );
      return;
    }

    const currentLocation =
      await Location.getCurrentPositionAsync({});

    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    Alert.alert('Success', 'Location captured successfully!');
  } catch (error) {
    Alert.alert('Error', 'Could not get your location. Please try again.');
  }
};
 const showMessage = (feature) => {
    Alert.alert(
      'CiviQ',
      `${feature} screen will be connected soon.`
    );
  };  if (currentScreen === 'report') {
    return (
      <View style={{ flex: 1, backgroundColor: '#F6F8FC', padding: 24, paddingTop: 50 }}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={{ color: '#13A879', fontSize: 17 }}>
            ← Back to Home
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 28, fontWeight: '800', color: '#172B4D', marginTop: 28, marginBottom: 20 }}>
          Report an Issue
        </Text>

        <TextInput
          placeholder="Issue title"
          value={issueTitle}
          onChangeText={setIssueTitle}
          style={{ backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 14 }}
        />

        <TextInput
          placeholder="Category (Road, Water, Garbage...)"
          value={category}
          onChangeText={setCategory}
          style={{ backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 14 }}
        />

        <TextInput
          placeholder="Describe the problem"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ backgroundColor: 'white', padding: 15, borderRadius: 12, height: 130, marginBottom: 20 }}
        />

        <TouchableOpacity
  onPress={pickImage}
  style={{
    backgroundColor: '#E1F7F0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  }}
>
  <Text style={{ color: '#13A879', fontWeight: '700' }}>
    📸 Choose Issue Photo
  </Text>
</TouchableOpacity>

{imageUri && (
  <Image
    source={{ uri: imageUri }}
    style={{
      width: '100%',
      height: 180,
      borderRadius: 12,
      marginBottom: 15,
    }}
    resizeMode="cover"
      />
)}
  


<TouchableOpacity
  onPress={getCurrentLocation}
  style={{
    backgroundColor: '#E1F7F0',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  }}
>
  <Text style={{ color: '#13A879', fontWeight: '700' }}>
    📍 Get Current Location
  </Text>
</TouchableOpacity>

{location && (
  <Text style={{ color: '#17365D', marginBottom: 15 }}>
    Location: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
  </Text>
)}<TouchableOpacity
          onPress={() => {
            if (!issueTitle.trim() || !category.trim() || !description.trim()) {
              Alert.alert('Missing details', 'Please fill in all fields.');
              return;
            }

            Alert.alert('Success', 'Demo report submitted!');
            setIssueTitle('');
            setCategory('');
            setDescription('');
            setCurrentScreen('home');
          }}
          style={{ backgroundColor: '#13A879', padding: 16, borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
            Submit Report
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F6F8FC"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🏙️</Text>
            </View>

            <Text style={styles.logoText}>
              Civi<Text style={styles.logoGreen}>Q</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => showMessage('Profile')}
          >
            <Text style={styles.profileEmoji}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <Text style={styles.helloText}>Hello, Citizen 👋</Text>
          <Text style={styles.heading}>
            Let's make our city
          </Text>
          <Text style={styles.headingGreen}>better together.</Text>
          <Text style={styles.subtitle}>
            Report local problems. Make a real difference.
          </Text>
        </View>

        {/* Main report card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTextArea}>
            <Text style={styles.heroSmallText}>
              SEE A PROBLEM?
            </Text>

            <Text style={styles.heroTitle}>
              Your city,{'\n'}your voice.
            </Text>

            <Text style={styles.heroDescription}>
              Report a civic issue and help your
              community.
            </Text>

            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => setCurrentScreen('report')}
            >
              <Text style={styles.reportButtonText}>
                + Report an Issue
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroIllustration}>
            <Text style={styles.cityEmoji}>🏙️</Text>
            <Text style={styles.pinEmoji}>📍</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Browse Categories
          </Text>

          <TouchableOpacity
            onPress={() => showMessage('All Categories')}
          >
            <Text style={styles.seeAll}>See all →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.categoryCard}
              onPress={() => showMessage(item.title)}
            >
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: item.color },
                ]}
              >
                <Text style={styles.categoryEmoji}>
                  {item.icon}
                </Text>
              </View>

              <Text style={styles.categoryTitle}>
                {item.title}
              </Text>

              <Text style={styles.categoryArrow}>↗</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent reports */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Reports
          </Text>

          <TouchableOpacity
            onPress={() => showMessage('My Reports')}
          >
            <Text style={styles.seeAll}>View all →</Text>
          </TouchableOpacity>
        </View>

        {reports.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.reportCard}
            onPress={() => showMessage(item.title)}
          >
            <View
              style={[
                styles.reportIcon,
                { backgroundColor: item.color },
              ]}
            >
              <Text style={styles.reportEmoji}>
                {item.icon}
              </Text>
            </View>

            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>
                {item.title}
              </Text>
              <Text style={styles.reportLocation}>
                📍 {item.location}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.statusColor + '18' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: item.statusColor },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom note */}
        <View style={styles.footer}>
          <Text style={styles.footerIcon}>💚</Text>
          <Text style={styles.footerText}>
            Together, let's build a better city.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => showMessage('Home')}
        >
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navActiveText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => showMessage('Map')}
        >
          <Text style={styles.navIcon}>📍</Text>
          <Text style={styles.navText}>Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => showMessage('My Reports')}
        >
          <Text style={styles.navIcon}>▤</Text>
          <Text style={styles.navText}>My Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => showMessage('Notifications')}
        >
          <Text style={styles.navIcon}>♧</Text>
          <Text style={styles.navText}>Alerts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#DDF5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 23,
  },
  logoText: {
    fontSize: 27,
    fontWeight: '800',
    color: '#172B4D',
    letterSpacing: -1,
  },
  logoGreen: {
    color: '#13A879',
  },
  profileButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EAF2',
  },
  profileEmoji: {
    fontSize: 21,
  },
  welcomeSection: {
    marginBottom: 23,
  },
  helloText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#65728A',
    marginBottom: 9,
  },
  heading: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    color: '#172B4D',
  },
  headingGreen: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '800',
    color: '#13A879',
  },
  subtitle: {
    fontSize: 13,
    color: '#748098',
    marginTop: 10,
    lineHeight: 20,
  },
  heroCard: {
    backgroundColor: '#17365D',
    borderRadius: 24,
    padding: 21,
    minHeight: 240,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 30,
  },
  heroTextArea: {
    flex: 1,
    zIndex: 1,
  },
  heroSmallText: {
    color: '#8DE1BC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 33,
  },
  heroDescription: {
    color: '#D4DFEF',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    maxWidth: 205,
  },
  reportButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#19B47E',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 18,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  heroIllustration: {
    position: 'absolute',
    right: -5,
    bottom: 24,
    opacity: 0.9,
  },
  cityEmoji: {
    fontSize: 83,
  },
  pinEmoji: {
    position: 'absolute',
    fontSize: 31,
    top: -15,
    left: 9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#172B4D',
    fontWeight: '800',
  },
  seeAll: {
    fontSize: 12,
    color: '#13A879',
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDF0F6',
    minHeight: 115,
  },
  categoryIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 23,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#293B58',
  },
  categoryArrow: {
    position: 'absolute',
    right: 14,
    bottom: 12,
    fontSize: 17,
    color: '#93A0B5',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#EDF0F6',
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportEmoji: {
    fontSize: 24,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    color: '#243653',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  reportLocation: {
    color: '#8490A4',
    fontSize: 11,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    marginLeft: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
    marginBottom: 7,
  },
  footerIcon: {
    fontSize: 15,
    marginRight: 7,
  },
  footerText: {
    fontSize: 11,
    color: '#8893A7',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop: 11,
    paddingBottom: 17,
    borderTopWidth: 1,
    borderTopColor: '#EAEFF5',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 65,
  },
  navIcon: {
    fontSize: 22,
    color: '#13A879',
    marginBottom: 4,
  },
  navActiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#13A879',
  },
  navText: {
    fontSize: 10,
    color: '#8490A4',
    marginTop: 4,
  },
});