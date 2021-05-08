import {MongoClient, ObjectId} from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
    return (
       <MeetupDetail 
       image={props.meetupData.image} 
       title={props.meetupData.title} 
       address={props.meetupData.address} 
       description={props.meetupData.description} 
       />
    );
}

export async function getStaticPaths() {
    const client = await MongoClient.connect('mongodb+srv://admin:secret123@cluster0.e6bvz.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();

    client.close();

    return {
        fallback: false,
        paths: meetups.map(meetup => ({params: {meetupId: meetup._id.toString()},
        })),
    };
}

export async function getStaticProps(context){

    const meetupId = context.params.meetupId;

    console.log("id: "+meetupId);

    const client = await MongoClient.connect('mongodb+srv://admin:secret123@cluster0.e6bvz.mongodb.net/meetups?retryWrites=true&w=majority',
    { useUnifiedTopology: true });
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetup = await meetupsCollection.findOne({}, {_id: ObjectId(meetupId)});

    console.log(meetup);

    client.close();

    return {
        props: {
            meetupData: {
                id: meetup._id.toString(),
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                description: meetup.description
        },
      },
    };
  }

export default MeetupDetails;