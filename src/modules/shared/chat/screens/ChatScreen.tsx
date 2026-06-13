import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  ActivityIndicator, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../../../context/AppContext';
import { useToast } from '../../../../context/ToastContext';
import type { Message } from '../../../../services/api/store';

const { width } = Dimensions.get('window');

const C = {
  bg: '#060D1F', card: '#1E293B', border: 'rgba(255,255,255,0.07)',
  primary: '#38BDF8', accent: '#F97316', success: '#34D399', danger: '#EF4444',
  text: '#F1F5F9', muted: '#94A3B8', subtle: '#475569',
};

function timeStr(ts: string) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return '';
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function ChatScreen({ route, navigation }: any) {
  const { conversationId, sellerName = 'Seller', sellerId = '', offerId, offerTitle } = route.params ?? {};
  const { user, getMessages, sendMessage, markConversationRead, deleteConversation, openConversation } = useApp();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(conversationId || null);
  const flatListRef = useRef<FlatList>(null);

  // Load or create conversation + messages
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let convId = conversationId;

      // If no conversationId, create one (buyer → seller flow)
      if (!convId && sellerId && user?.role === 'buyer') {
        const conv = await openConversation(sellerId, sellerName, offerId, offerTitle);
        convId = conv?.id ?? null;
        setActiveConvId(convId);
      }

      if (convId) {
        const msgs = await getMessages(convId);
        setMessages(msgs);
        await markConversationRead(convId);
      }
      setLoading(false);
    };
    init();
  }, [conversationId]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !activeConvId || !user) return;
    setSending(true);
    setInputText('');
    const toId = user.role === 'buyer' ? sellerId : (messages[0]?.fromId === user.id ? messages[0]?.toId : messages[0]?.fromId) ?? '';
    const msg = await sendMessage(activeConvId, toId, text);
    if (msg) {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } else {
      showToast('Failed to send message', 'error');
      setInputText(text);
    }
    setSending(false);
  };

  const handleDeleteConversation = () => {
    Alert.alert('Delete Conversation', 'This will delete all messages permanently.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          if (activeConvId) await deleteConversation(activeConvId);
          showToast('Conversation deleted', 'info');
          navigation.goBack();
        },
      },
    ]);
  };

  const renderMessage = useCallback(({ item, index }: { item: Message; index: number }) => {
    const isMe = item.fromId === user?.id;
    const prevMsg = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isMe && (!prevMsg || prevMsg.fromId !== item.fromId);
    const showName = showAvatar;

    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowMe : styles.msgRowThem]}>
        {!isMe && (
          <View style={[styles.avatar, { opacity: showAvatar ? 1 : 0 }]}>
            <Text style={styles.avatarText}>{getInitials(item.fromName)}</Text>
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          {showName && !isMe && <Text style={styles.fromName}>{item.fromName}</Text>}
          <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.text}</Text>
          <View style={styles.msgMeta}>
            <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{timeStr(item.createdAt)}</Text>
            {isMe && <Ionicons name={item.read ? 'checkmark-done' : 'checkmark'} size={12} color={item.read ? C.primary : 'rgba(255,255,255,0.5)'} />}
          </View>
        </View>
      </View>
    );
  }, [messages, user?.id]);

  return (
    <LinearGradient colors={['#060D1F', '#0F172A', '#1B2A4A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

        {/* Chat header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </TouchableOpacity>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{getInitials(sellerName)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerName}>{sellerName}</Text>
            {offerTitle && <Text style={styles.headerSub} numberOfLines={1}>Re: {offerTitle}</Text>}
          </View>
          <TouchableOpacity style={styles.headerAction} onPress={handleDeleteConversation}>
            <Ionicons name="trash-outline" size={18} color={C.danger} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        {loading ? (
          <View style={styles.center}><ActivityIndicator color={C.primary} size="large" /></View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Ionicons name="chatbubbles-outline" size={48} color={C.subtle} />
                <Text style={styles.emptyChatText}>Start the conversation!</Text>
                <Text style={styles.emptyChatSub}>Send a message to {sellerName}</Text>
              </View>
            }
          />
        )}

        {/* Input bar */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputBar}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={C.muted}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || sending}
              activeOpacity={0.8}
            >
              {sending
                ? <ActivityIndicator color="#fff" size="small" />
                : <Ionicons name="send" size={18} color="#fff" />
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, gap: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center' },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { color: '#060D1F', fontWeight: '800', fontSize: 13 },
  headerName: { fontSize: 15, fontWeight: '700', color: C.text },
  headerSub: { fontSize: 11, color: C.muted },
  headerAction: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.danger + '15', justifyContent: 'center', alignItems: 'center' },

  messagesList: { paddingHorizontal: 12, paddingVertical: 16, gap: 4 },

  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6, gap: 8 },
  msgRowMe: { justifyContent: 'flex-end' },
  msgRowThem: { justifyContent: 'flex-start' },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.accent, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  bubble: { maxWidth: width * 0.72, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  bubbleMe: { backgroundColor: C.primary, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: C.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.border },
  fromName: { fontSize: 10, fontWeight: '700', color: C.accent, marginBottom: 3 },
  msgText: { fontSize: 14, color: C.muted, lineHeight: 20 },
  msgTextMe: { color: '#060D1F', fontWeight: '500' },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: 'flex-end' },
  msgTime: { fontSize: 10, color: C.subtle },
  msgTimeMe: { color: 'rgba(6,13,31,0.6)' },

  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 10 },
  emptyChatText: { fontSize: 18, fontWeight: '700', color: C.text },
  emptyChatSub: { fontSize: 13, color: C.muted },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: '#0A1628' },
  inputWrap: { flex: 1, backgroundColor: C.card, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: C.border, maxHeight: 120 },
  input: { color: C.text, fontSize: 14, paddingVertical: 6 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
});
