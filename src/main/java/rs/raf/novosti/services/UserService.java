package rs.raf.novosti.services;

import rs.raf.novosti.entities.User;
import rs.raf.novosti.entities.UserType;
import rs.raf.novosti.repositories.user.UserRepository;

import javax.inject.Inject;
import java.util.List;

public class UserService {

    @Inject
    private UserRepository userRepository;

    public List<User> allUsers(int page, int pageSize) {
        return this.userRepository.findAll(page, pageSize);
    }

    public int userCount() {
        return this.userRepository.count();
    }

    public User findUser(Long id) {
        return this.userRepository.findById(id);
    }

    public User addUser(User user) {
        // da li mejl postoji
        User existing = this.userRepository.findByEmail(user.getEmail());
        if (existing != null) {
            return null;
        }
        return this.userRepository.save(user);
    }

    public User updateUser(Long id, User userData) {
        User user = this.userRepository.findById(id);
        if (user == null) {
            return null;
        }

        User emailUser = this.userRepository.findByEmail(userData.getEmail());
        if (emailUser != null && !emailUser.getId().equals(id)) {
            return null;
        }

        user.setEmail(userData.getEmail());
        user.setName(userData.getName());
        user.setSurname(userData.getSurname());
        user.setUserType(userData.getUserType());

        return this.userRepository.update(user);
    }

    public void toggleStatus(Long id) {
        User user = this.userRepository.findById(id);
        if (user != null && user.getUserType() == UserType.CREATOR) {
            this.userRepository.updateStatus(id, !user.isStatus());
        }
    }
}
