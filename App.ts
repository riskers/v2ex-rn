import * as React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

const HOT_URL = 'https://www.v2ex.com/api/topics/hot.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

interface ITopics {
  key: number;
  url: string;
  avatar: string;
  title: string;
}

interface IProps {}
interface IState {
  hotTopics: ITopics[];
}

export default class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      hotTopics: [],
    };
  }

  getchHotTopics() {
    fetch(HOT_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const hotTopics = data.map((item: ITopics) => {
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

        this.setState({
          hotTopics,
        });
      });
  }

  componentDidMount() {
    this.getchHotTopics();
  }

  renderTopic = ({ item }) => {
    return (
      <View key={ item.key }>
        <Text>{ item.title }</Text>
      </View>
    );
  }

  render() {
    const {
      hotTopics,
    } = this.state;

    return (
      <View style={ styles.container }>
        <FlatList
          data={ hotTopics }
          renderItem={ this.renderTopic }
        />
      </View>
    );
  }
}
