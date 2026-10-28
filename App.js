
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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



export default function App() {
  const [reports, setReports] = useState([
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
]);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminFilter, setAdminFilter] = useState('All');
  const [citizenName, setCitizenName] = useState('');
const [citizenEmail, setCitizenEmail] = useState('');
const [citizenPassword, setCitizenPassword] = useState('');
const [isCitizenSignup, setIsCitizenSignup] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportsLoaded, setReportsLoaded] = useState(false);
const [issueTitle, setIssueTitle] = useState('');
const [description, setDescription] = useState('');
const [issuePriority, setIssuePriority] = useState('Medium');
const [category, setCategory] = useState('');
const [imageUri, setImageUri] = useState(null);
const [location, setLocation] = useState(null);
const [officerId, setOfficerId] = useState('');
const [officerPassword, setOfficerPassword] = useState('');
const [officerSearch, setOfficerSearch] = useState('');
const [officerStatusFilter, setOfficerStatusFilter] = useState('All');
const [officerPriorityFilter, setOfficerPriorityFilter] = useState('All');
const filteredOfficerReports = reports.filter((item) => {
  const query = officerSearch.trim().toLowerCase();

  const searchableText =
    `${item.title || ''} ${item.category || ''}`.toLowerCase();

  const matchesSearch = searchableText.includes(query);

 const matchesStatus =
  officerStatusFilter === 'All' ||
  (item.status || 'Submitted') === officerStatusFilter;

const matchesPriority =
  officerPriorityFilter === 'All' ||
  (item.priority || 'Medium') === officerPriorityFilter;

return matchesSearch && matchesStatus && matchesPriority;
});
// Load saved reports when the app opens
useEffect(() => {
  const loadReports = async () => {
    try {
      const savedReports = await AsyncStorage.getItem('civiq_reports');

      if (savedReports !== null) {
        setReports(JSON.parse(savedReports));
      }
    } catch (error) {
      console.error('Could not load reports:', error);
    } finally {
      setReportsLoaded(true);
    }
  };

  loadReports();
}, []);

// Save reports whenever the list changes
useEffect(() => {
  if (!reportsLoaded) {
    return;
  }

  const saveReports = async () => {
    try {
      await AsyncStorage.setItem(
        'civiq_reports',
        JSON.stringify(reports)
      );
    } catch (error) {
      console.error('Could not save reports:', error);
    }
  };

  saveReports();
}, [reports, reportsLoaded]);
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
  }; 
  // Officer Login Screen
if (currentScreen === 'officerLogin') {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F8FC',
        padding: 24,
        paddingTop: 50,
      }}
    >
      <TouchableOpacity
        onPress={() => setCurrentScreen('home')}
      >
        <Text
          style={{
            color: '#13A879',
            fontSize: 17,
            fontWeight: '600',
          }}
        >
          ← Back to Home
        </Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', marginTop: 45 }}>
        <Text style={{ fontSize: 52 }}>🛡️</Text>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#172B4D',
            marginTop: 16,
          }}
        >
          Officer Login
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: '#718096',
            marginTop: 8,
            textAlign: 'center',
          }}
        >
          Sign in to manage civic reports.
        </Text>
      </View>

      <TextInput
        placeholder="Officer ID"
        value={officerId}
        onChangeText={setOfficerId}
        autoCapitalize="none"
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 12,
          marginTop: 35,
          marginBottom: 14,
        }}
      />

      <TextInput
        placeholder="Password"
        value={officerPassword}
        onChangeText={setOfficerPassword}
        secureTextEntry
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={() => {
          if (!officerId.trim() || !officerPassword.trim()) {
            Alert.alert(
              'Missing Details',
              'Please enter Officer ID and Password.'
            );
            return;
          }

          setCurrentScreen('officerDashboard');
        }}
        style={{
          backgroundColor: '#13A879',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
 
  // Officer Dashboard
if (currentScreen === 'officerDashboard') {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F8FC',
        padding: 24,
        paddingTop: 50,
      }}
    >
      <TouchableOpacity
        onPress={() => setCurrentScreen('officerLogin')}
      >
        <Text
          style={{
            color: '#13A879',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          ← Logout
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: '#172B4D',
          marginTop: 28,
        }}
      >
        Officer Dashboard
      </Text>

      <Text
        style={{
          color: '#718096',
          marginTop: 8,
          marginBottom: 24,
        }}
      >
        Manage civic issues and their status.
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {[
          {
            title: 'Total Reports',
            count: reports.length,
            color: '#E6EEFF',
          },
          {
            title: 'Submitted',
            count: reports.filter(
              item => item.status === 'Submitted'
            ).length,
            color: '#FFF0D2',
          },
          {
            title: 'In Progress',
            count: reports.filter(
              item => item.status === 'In Progress'
            ).length,
            color: '#E1F7F5',
          },
          {
            title: 'Resolved',
            count: reports.filter(
              item => item.status === 'Resolved'
            ).length,
            color: '#E2F6E9',
          },
        ].map(item => (
          <View
            key={item.title}
            style={{
              width: '48%',
              backgroundColor: item.color,
              padding: 16,
              borderRadius: 14,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#526174', fontSize: 13 }}>
              {item.title}
            </Text>

            <Text
              style={{
                fontSize: 28,
                fontWeight: '800',
                color: '#172B4D',
                marginTop: 8,
              }}
            >
              {item.count}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={{
          fontSize: 21,
          fontWeight: '700',
          color: '#172B4D',
          marginTop: 16,
          marginBottom: 14,
        }}
      >
        All Reports
      </Text>

      
<ScrollView showsVerticalScrollIndicator={false}>
  {/* Search Reports */}
  <TextInput
    placeholder="Search by title or category..."
    value={officerSearch}
    onChangeText={setOfficerSearch}
    style={{
      backgroundColor: 'white',
      padding: 14,
      borderRadius: 12,
      marginBottom: 12,
      fontSize: 15,
    }}
  />

  {/* Status Filters */}
  <View
    style={{
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    }}
  >
    {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map(
      (status) => (
        <TouchableOpacity
          key={status}
          onPress={() => setOfficerStatusFilter(status)}
          style={{
            backgroundColor:
              officerStatusFilter === status ? '#13A879' : 'white',
            paddingVertical: 9,
            paddingHorizontal: 12,
            borderRadius: 10,
            marginRight: 7,
            marginBottom: 7,
          }}
        >
          <Text
            style={{
              color:
                officerStatusFilter === status ? 'white' : '#172B4D',
              fontWeight: '600',
              fontSize: 12,
            }}
          >
            {status}
          </Text>
        </TouchableOpacity>
      )
    )}
  </View>

  {/* Filtered Reports */}
  {/* Priority Filters */}
<Text
  style={{
    fontSize: 14,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 8,
  }}
>
  Filter by Priority
</Text>

<View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  }}
>
  {['All', 'High', 'Medium', 'Low'].map((priority) => (
    <TouchableOpacity
      key={priority}
      onPress={() => setOfficerPriorityFilter(priority)}
      style={{
        backgroundColor:
          officerPriorityFilter === priority ? '#13A879' : 'white',
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor:
          officerPriorityFilter === priority ? '#13A879' : '#D9E2EC',
      }}
    >
      <Text
        style={{
          color:
            officerPriorityFilter === priority ? 'white' : '#172B4D',
          fontWeight: '600',
        }}
      >
        {priority}
      </Text>
    </TouchableOpacity>
  ))}
</View>
  {filteredOfficerReports.length === 0 ? (
    <Text style={{ color: '#718096', marginBottom: 12 }}>
      {reports.length === 0
        ? 'No reports available.'
        : 'No reports match your search or selected status.'}
    </Text>
  ) : (
    filteredOfficerReports.map((item, index) => (
      <View
        key={`${item.title}-${item.location || index}`}
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 14,
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setSelectedReport(item);
            setCurrentScreen('reportDetails');
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: '#172B4D',
            }}
          >
            {item.icon || '📋'} {item.title}
          </Text>

          <Text
            style={{
              color: '#718096',
              marginTop: 6,
              marginBottom: 8,
            }}
          >
            {item.location || 'Location not provided'}
          </Text>

          <Text
            style={{
              color: item.statusColor || '#315FD3',
              fontWeight: '700',
            }}
          >
            Status: {item.status || 'Submitted'}
          </Text>

          <Text
            style={{
              color: '#13A879',
              marginTop: 8,
              fontWeight: '600',
            }}
          >
            <Text
  style={{
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '700',
    color:
      item.priority === 'High'
        ? '#D93025'
        : item.priority === 'Low'
        ? '#16803C'
        : '#D97706',
  }}
>
  Priority: {item.priority || 'Medium'}
</Text>
            View Details →
          </Text>
        </TouchableOpacity>
{/* Officer Remarks */}
<Text
  style={{
    fontSize: 14,
    fontWeight: '700',
    color: '#172B4D',
    marginTop: 12,
    marginBottom: 6,
  }}
>
  Officer Remarks
</Text>

<TextInput
  placeholder="Enter action taken or remarks..."
  value={item.officerRemarks || ''}
  onChangeText={(text) => {
    setReports((previousReports) =>
      previousReports.map((report) =>
        report === item
          ? { ...report, officerRemarks: text }
          : report
      )
    );
  }}
  multiline
  style={{
    backgroundColor: '#F6F8FC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    minHeight: 70,
    textAlignVertical: 'top',
    marginBottom: 12,
  }}
/>{/* Resolution Photo */}
<TouchableOpacity
  onPress={async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo library access.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const photoUri = result.assets[0].uri;

        setReports((previousReports) =>
          previousReports.map((report) =>
            report === item
              ? { ...report, resolutionImageUri: photoUri }
              : report
          )
        );
      }
    } catch (error) {
      Alert.alert('Photo Error', 'Could not select the photo.');
    }
  }}
  style={{
    backgroundColor: '#E1F7F0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  }}
>
  <Text style={{ color: '#13A879', fontWeight: '700' }}>
    📸 Add Resolution Photo
  </Text>
</TouchableOpacity>

{item.resolutionImageUri ? (
  <Image
    source={{ uri: item.resolutionImageUri }}
    style={{
      width: '100%',
      height: 160,
      borderRadius: 12,
      marginBottom: 12,
    }}
    resizeMode="cover"
  />
) : null}
{/* Department Assignment */}
<Text
  style={{
    color: '#172B4D',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  }}
>
  Department: {item.department || 'Not assigned'}
</Text>

<View
  style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  }}
>
  {[
    'Roads',
    'Water Supply',
    'Sanitation',
    'Streetlights',
  ].map((department) => (
    <TouchableOpacity
      key={department}
      onPress={() => {
        setReports((previousReports) =>
          previousReports.map((report) =>
            report === item
              ? { ...report, department }
              : report
          )
        );

        Alert.alert(
          'Department Assigned',
          `${item.title} assigned to ${department}.`
        );
      }}
      style={{
        backgroundColor:
          item.department === department ? '#13A879' : '#E1F7F0',
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 7,
        marginBottom: 7,
      }}
    >
      <Text
        style={{
          color:
            item.department === department ? 'white' : '#137A5A',
          fontWeight: '600',
          fontSize: 12,
        }}
      >
        {department}
      </Text>
    </TouchableOpacity>
  ))}
</View>
        {/* Status Update Buttons */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 12,
          }}
        >
          {[
            {
              label: 'Assign',
              status: 'Assigned',
              color: '#B77913',
            },
            {
              label: 'In Progress',
              status: 'In Progress',
              color: '#315FD3',
            },
            {
              label: 'Resolved',
              status: 'Resolved',
              color: '#16803C',
            },
          ].map((action) => (
            <TouchableOpacity
              key={action.status}
              onPress={() => {
                setReports((previousReports) =>
                  previousReports.map((report) =>
                    report === item
                      ? {
                          ...report,
                          status: action.status,
                          statusColor: action.color,
                        }
                      : report
                  )
                );

                Alert.alert(
                  'Status Updated',
                  `${item.title} marked as ${action.status}.`
                );
              }}
              style={{
                backgroundColor: action.color,
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: 8,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ))
  )}
</ScrollView>
</View>
  );
}
// Citizen Login and Signup
if (currentScreen === 'citizenLogin') {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F8FC',
        padding: 24,
        paddingTop: 50,
      }}
    >
      <TouchableOpacity
        onPress={() => setCurrentScreen('home')}
      >
        <Text
          style={{
            color: '#13A879',
            fontSize: 17,
            fontWeight: '600',
          }}
        >
          ← Back to Home
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 30,
          fontWeight: '800',
          color: '#172B4D',
          marginTop: 40,
          marginBottom: 8,
        }}
      >
        {isCitizenSignup ? 'Create Account' : 'Citizen Login'}
      </Text>

      <Text
        style={{
          color: '#718096',
          marginBottom: 28,
        }}
      >
        {isCitizenSignup
          ? 'Join CiviQ to report civic issues.'
          : 'Login to manage your civic reports.'}
      </Text>

      {isCitizenSignup && (
        <TextInput
          placeholder="Full Name"
          value={citizenName}
          onChangeText={setCitizenName}
          style={{
            backgroundColor: 'white',
            padding: 15,
            borderRadius: 12,
            marginBottom: 14,
          }}
        />
      )}

      <TextInput
        placeholder="Email Address"
        value={citizenEmail}
        onChangeText={setCitizenEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 12,
          marginBottom: 14,
        }}
      />

      <TextInput
        placeholder="Password"
        value={citizenPassword}
        onChangeText={setCitizenPassword}
        secureTextEntry
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={() => {
          if (
            !citizenEmail.trim() ||
            !citizenPassword.trim() ||
            (isCitizenSignup && !citizenName.trim())
          ) {
            Alert.alert(
              'Missing Details',
              'Please fill in all required fields.'
            );
            return;
          }

          Alert.alert(
            'Login UI Ready',
            'Real account verification will be connected to the backend.'
          );
        }}
        style={{
          backgroundColor: '#13A879',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '700',
          }}
        >
          {isCitizenSignup ? 'Create Account' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsCitizenSignup(!isCitizenSignup)}
        style={{
          marginTop: 22,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#13A879',
            fontWeight: '600',
          }}
        >
          {isCitizenSignup
            ? 'Already have an account? Login'
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
if (currentScreen === 'adminLogin') {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F8FC',
        padding: 24,
        paddingTop: 60,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          setAdminPassword('');
          setCurrentScreen('home');
        }}
      >
        <Text style={{ color: '#13A879', fontSize: 17 }}>
          ← Back to Home
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 30,
          fontWeight: '800',
          color: '#172B4D',
          marginTop: 45,
          marginBottom: 12,
        }}
      >
        Admin Login
      </Text>

      <Text style={{ color: '#64748B', marginBottom: 25 }}>
        Sign in to manage CiviQ complaints.
      </Text>

      <TextInput
        placeholder="Admin password"
        value={adminPassword}
        onChangeText={setAdminPassword}
        secureTextEntry
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={() => {
  if (!adminPassword.trim()) {
    Alert.alert('Required', 'Please enter the admin password.');
    return;
  }

  setAdminPassword('');
  setCurrentScreen('adminDashboard');
}}
        style={{
          backgroundColor: '#13A879',
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
          Login as Admin
        </Text>
      </TouchableOpacity>
    </View>
  );
}

   
    
if (currentScreen === 'adminDashboard') {
  const allReports = reports || [];

  const submittedCount = allReports.filter(
    (r) => r.status === 'Submitted'
  ).length;

  const progressCount = allReports.filter(
    (r) => r.status === 'In Progress'
  ).length;

  const resolvedCount = allReports.filter(
    (r) => r.status === 'Resolved'
  ).length;

  const filteredReports =
    adminFilter === 'All'
      ? allReports
      : allReports.filter((r) => r.status === adminFilter);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F6F8FC' }}
      contentContainerStyle={{ padding: 20, paddingTop: 55 }}
    >
      <TouchableOpacity onPress={() => setCurrentScreen('home')}>
        <Text style={{ color: '#13A879', fontSize: 16 }}>
          ← Back to Home
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: '#172B4D',
          marginTop: 25,
        }}
      >
        Admin Dashboard 🛡️
      </Text>

      <Text style={{ color: '#64748B', marginTop: 6, marginBottom: 22 }}>
        Manage and monitor citizen complaints.
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {[
          { title: 'Total Reports', count: allReports.length, color: '#172B4D' },
          { title: 'Submitted', count: submittedCount, color: '#D97706' },
          { title: 'In Progress', count: progressCount, color: '#2563EB' },
          { title: 'Resolved', count: resolvedCount, color: '#13A879' },
        ].map((item) => (
          <View
            key={item.title}
            style={{
              width: '47%',
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 14,
              borderLeftWidth: 4,
              borderLeftColor: item.color,
              marginBottom: 4,
            }}
          >
            <Text style={{ color: '#64748B', fontSize: 13 }}>
              {item.title}
            </Text>
            <Text
              style={{
                color: item.color,
                fontSize: 27,
                fontWeight: '800',
                marginTop: 8,
              }}
            >
              {item.count}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: '#172B4D',
          marginTop: 28,
          marginBottom: 12,
        }}
      >
        All Complaints
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map(
            (status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setAdminFilter(status)}
                style={{
                  paddingVertical: 9,
                  paddingHorizontal: 14,
                  borderRadius: 20,
                  backgroundColor:
                    adminFilter === status ? '#13A879' : 'white',
                }}
              >
                <Text
                  style={{
                    color: adminFilter === status ? 'white' : '#334155',
                    fontWeight: '600',
                  }}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>

      {filteredReports.length === 0 ? (
        <View
          style={{
            backgroundColor: 'white',
            padding: 22,
            borderRadius: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: '#64748B' }}>
            No complaints found.
          </Text>
        </View>
      ) : (
        filteredReports.map((report, index) => (
          <View
            key={report.id || report.reportId || index}
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 14,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#172B4D' }}>
              {report.title || report.category || 'Citizen Complaint'}
            </Text>

            <Text style={{ color: '#64748B', marginTop: 6 }}>
              Category: {report.category || 'Not specified'}
            </Text>

            <Text style={{ color: '#64748B', marginTop: 4 }}>
              Priority: {report.priority || 'Not specified'}
            </Text>

            <Text style={{ color: '#13A879', marginTop: 6, fontWeight: '700' }}>
              Status: {report.status || 'Submitted'}
            </Text>

            {report.description ? (
              <Text style={{ color: '#334155', marginTop: 8 }}>
                {report.description}
              </Text>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}
if (currentScreen === 'report') {
    

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
        {/* Issue Priority */}
<Text
  style={{
    fontSize: 16,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 10,
  }}
>
  Select Priority
</Text>

<View
  style={{
    flexDirection: 'row',
    marginBottom: 18,
  }}
>
  {[
    { label: 'High', color: '#D93025' },
    { label: 'Medium', color: '#D97706' },
    { label: 'Low', color: '#16803C' },
  ].map((option) => (
    <TouchableOpacity
      key={option.label}
      onPress={() => setIssuePriority(option.label)}
      style={{
        flex: 1,
        paddingVertical: 12,
        marginRight: 8,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor:
          issuePriority === option.label
            ? option.color
            : 'white',
        borderWidth: 1,
        borderColor: option.color,
      }}
    >
      <Text

        style={{
          color:
            issuePriority === option.label
              ? 'white'
              : option.color,
          fontWeight: '700',
        }}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  ))}
</View>

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

            setReports((previousReports) => [
  {
    icon: category.toLowerCase().includes('water')
      ? '💧'
      : category.toLowerCase().includes('garbage')
      ? '🗑️'
      : category.toLowerCase().includes('light')
      ? '💡'
      : '🛣️',

    title: issueTitle.trim(),
    category: category.trim(),
    location: location
      ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
      : 'Not provided',

    status: 'Submitted',
    priority: issuePriority,
    color: '#E6EEFF',
    statusColor: '#315FD3',
    description: description.trim(),
    imageUri: imageUri,
  },
  ...previousReports,
]);

Alert.alert(
  'Success',
  'Your report has been added to My Reports.'
);
            setIssueTitle('');
            setCategory('');
            setDescription('');
            setCurrentScreen('home');
            setImageUri(null);
setLocation(null);
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

    
      if (currentScreen === 'reportDetails') {

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F8FC',
        padding: 24,
        paddingTop: 50,
      }}
    >
      <TouchableOpacity
        onPress={() => setCurrentScreen('home')}
      >
        <Text
          style={{
            color: '#13A879',
            fontSize: 17,
            fontWeight: '600',
          }}
        >
          ← Back to Home
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 28,
          fontWeight: '800',
          color: '#172B4D',
          marginTop: 28,
          marginBottom: 24,
        }}
      >
        Report Details
      </Text>

      {selectedReport ? (
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 38, marginBottom: 12 }}>
            {selectedReport.icon || '📋'}
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#172B4D',
              marginBottom: 20,
            }}
          >
            {selectedReport.title}
          </Text>
<Text style={{ color: '#718096', marginBottom: 6 }}>
  Category
</Text>
<Text style={{ fontSize: 16, marginBottom: 20 }}>
  {selectedReport.category || 'Not provided'}
</Text>

<Text style={{ color: '#718096', marginBottom: 6 }}>
  Description
</Text>
<Text style={{ fontSize: 16, marginBottom: 20 }}>
  {selectedReport.description || 'No description provided'}
</Text>

{selectedReport.imageUri ? (
  <Image
    source={{ uri: selectedReport.imageUri }}
    style={{
      width: '100%',
      height: 180,
      borderRadius: 12,
      marginBottom: 20,
    }}
    resizeMode="cover"
  />
) : null}
{/* Resolution Photo */}
{selectedReport.resolutionImageUri ? (
  <View style={{ marginBottom: 20 }}>
    <Text
      style={{
        color: '#718096',
        marginBottom: 8,
        fontWeight: '600',
      }}
    >
      Resolution Photo
    </Text>

    <Image
      source={{ uri: selectedReport.resolutionImageUri }}
      style={{
        width: '100%',
        height: 180,
        borderRadius: 12,
      }}
      resizeMode="cover"
    />
  </View>
) : null}
          <Text style={{ color: '#718096', marginBottom: 6 }}>
            Location
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            {selectedReport.location || 'Not provided'}
          </Text>

          <Text style={{ color: '#718096', marginBottom: 6 }}>
            Current Status
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: selectedReport.statusColor || '#13A879',
            }}
          >
            {selectedReport.status || 'Submitted'}
          </Text>
        </View>
      ) : (
        <Text>No report selected.</Text>
      )}
    </View>
  );
}
if (currentScreen === 'myReports') {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#F6F8FC',
          padding: 24,
          paddingTop: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => setCurrentScreen('home')}
        >
          <Text
            style={{
              color: '#13A879',
              fontSize: 17,
              fontWeight: '600',
            }}
          >
            ← Back to Home
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: '#172B4D',
            marginTop: 28,
          }}
        >
          My Reports
        </Text>

        <View style={{ flex: 1, marginTop: 24, paddingBottom: 20 }}>
  {reports.length === 0 ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60,
      }}
    >
      <Text style={{ fontSize: 50, marginBottom: 16 }}>
        📋
      </Text>

      <Text
        style={{
          fontSize: 21,
          fontWeight: '700',
          color: '#172B4D',
          marginBottom: 8,
        }}
      >
        No reports yet
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: '#718096',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        Your submitted civic issues will appear here.
      </Text>

      <TouchableOpacity
        onPress={() => setCurrentScreen('report')}
        style={{
          backgroundColor: '#13A879',
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
          + Report an Issue
        </Text>
      </TouchableOpacity>
    <TouchableOpacity
  onPress={() => {
    setAdminPassword('');
    setCurrentScreen('adminLogin');
  }}
  style={{
    backgroundColor: '#172B4D',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  }}
>
  <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
    🛡️ Admin Login
  </Text>
</TouchableOpacity>
</View>
  ) : (
    <ScrollView showsVerticalScrollIndicator={false}>
      {reports.map((item, index) => (
        <TouchableOpacity
          key={`${item.title}-${index}`}
          onPress={() => {
            setSelectedReport(item);
            setCurrentScreen('reportDetails');
          }}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 16,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 28, marginRight: 12 }}>
            {item.icon || '📋'}
          </Text>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#172B4D' }}>
              {item.title}
            </Text>

            <Text style={{ fontSize: 13, color: '#718096', marginTop: 5 }}>
              {item.location || 'Location not provided'}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: '700', color: item.statusColor || '#315FD3' }}>
            {item.status || 'Submitted'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )}
</View>
      </View>
    );
  }return (
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
           onPress={() => setCurrentScreen('officerLogin')}

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
            <TouchableOpacity
  onPress={() => {
    setIsCitizenSignup(false);
    setCurrentScreen('citizenLogin');
  }}
  style={{
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#13A879',
  }}
>
  <Text
    style={{
      color: '#13A879',
      fontSize: 15,
      fontWeight: '700',
    }}
  >
    👤 Citizen Login / Sign Up
  </Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={() => {
    setAdminPassword('');
    setCurrentScreen('adminLogin');
  }}
  style={{
    backgroundColor: '#172B4D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  }}
>
  <Text
    style={{
      color: 'white',
      fontSize: 15,
      fontWeight: '700',
    }}
  >
    🛡️ Admin Login
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
             onPress={() => {
  setSelectedReport(item);
  setCurrentScreen('reportDetails');
}}
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
           onPress={() => setCurrentScreen('myReports')}
          >
            <Text style={styles.seeAll}>View all →</Text>
          </TouchableOpacity>
        </View>

        {reports.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.reportCard}
            onPress={() => {
  setSelectedReport(item);
  setCurrentScreen('reportDetails');
}}
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
          onPress={() => setCurrentScreen('myReports')}>
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