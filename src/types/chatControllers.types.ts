interface typeCreatePersonalChatRequestBody {
  sender: string;
  receiver: string;
}

interface typeCreateGroupChatRequestBody {
  creator: string;
  members: string[];
  groupName: string;
  groupDescription: string;
}

export { typeCreatePersonalChatRequestBody, typeCreateGroupChatRequestBody };
