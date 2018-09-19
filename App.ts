import * as React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import Reactotron from 'reactotron-react-native';

const HOT_URL = 'https://www.v2ex.com/api/topics/hot.json';
const NEW_URL = 'https://www.v2ex.com/api/topics/latest.json';

const styles = StyleSheet.create({
  row: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    color: '#666',
  },
});

interface ITopics {
  key: number;
  url: string;
  avatar: string;
  title: string;
}

interface IRoute {
  key: string;
  title: string;
}

const routes: IRoute[] = [
  {key: 'HOT', title: 'hot topics'},
  {key: 'NEW', title: 'new topics'},
];

interface IProps {}
interface IState {
  tabIndex: number;
  hotTopics: ITopics[];
  newTopics: ITopics[];
}

export default class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      tabIndex: 0,
      hotTopics: [],
      newTopics: [],
    };
  }

  fetchTopics(topicUrl: string) {
    return fetch(topicUrl)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data.map((item: ITopics) => {
          const {
            id,
            url,
            title,
            member,
          } = item;

          const {
            avatar_normal,
          } = member;

          return {
            key: id.toString(),
            url,
            title,
            avatar: avatar_normal,
          };
        });
      })
  }

  fetchHotTopics() {
    this.fetchTopics(HOT_URL)
      .then((topics) => {
        this.setState({
          hotTopics: topics,
        });
      })
  }

  fetchNewTopics() {
    this.fetchTopics(NEW_URL)
      .then((topics) => {
        this.setState({
          newTopics: topics,
        });
      })
  }

  componentDidMount() {
    this.fetchHotTopics();
    this.fetchNewTopics();
  }

  onPressTopic = () => {

  }

  renderTopic = (topics) => {
    return (
      <FlatList
        data={topics}
        renderItem={({item}) => {
          return (
            <View key={item.key} style={styles.row}>
              <TouchableHighlight onPress={this.onPressTopic} activeOpacity={0.3}>
                <Text style={styles.title}>{item.title}</Text>
              </TouchableHighlight>
            </View>
          );
        }}
      />
    );
  }

  render() {
    const {
      tabIndex,
      hotTopics,
      newTopics,
    } = this.state;

    return (
      <TabView
        navigationState={{
          index: tabIndex,
          routes,
        }}
        renderScene={
          SceneMap(
            {
              HOT: () => {
                return this.renderTopic(hotTopics)
              },
              NEW: () => {
                return this.renderTopic(newTopics)
              },
            }
          )
        }
        onIndexChange={index => this.setState({tabIndex: index})}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />
    );
  }
}
