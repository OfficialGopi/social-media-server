interface typeCreatePersonalChatRequestBody {
  sender: string;
  receiver: string;
}

interface typeCreateGroupChatRequestBody {
  members: string[];
  groupName: string;
  groupDescription: string;
}

export { typeCreatePersonalChatRequestBody, typeCreateGroupChatRequestBody };
